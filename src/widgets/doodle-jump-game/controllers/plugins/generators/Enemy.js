import {Generator} from "./Generator";
import {Input} from "../../components/Input";
import {move} from "../../tweens/move";
import {isArray, isFinite, isObject} from "lodash";
import {tremble} from "../../tweens/tremble";
import {eventSubscription, lerp, Entity} from "@shared"
import {ENEMY, EnemyBehaviours} from "../../entities/enemy";
import {Events} from "../../constants/events";
import {GAME_SIZE} from "../../constants/game";
import {Tweens} from "../../constants/tweens";

export class Enemy extends Generator {
  generate() {
    const {eventBus} = this;

    const eEnemy = new Entity({type: ENEMY, eventBus}).init();

    this.prepareParent(eEnemy, ...arguments);
    this.prepareView(eEnemy, ...arguments);
    this.prepareBehaviour(eEnemy, ...arguments);
    this.prepareMatrix(eEnemy, ...arguments);
    this.prepareCollider(eEnemy, ...arguments);
    this.prepareCounter(eEnemy, ...arguments);
    this.prepareCombination(eEnemy, ...arguments);
    this.prepareInteractive(eEnemy, ...arguments);

    return eEnemy;
  }

  prepareParent(eEnemy, {eParent}) {
    if (!eParent) return;

    const {system} = this;

    const {cParent} = system.getEnemyInfo(eEnemy);
    const {cChild} = system.getPlatformInfo(eParent);

    cParent.parentUUID = eParent.uuid;
    cChild.add(eEnemy.uuid);
  }

  prepareView(eEnemy, {texture, size: {width, height}}) {
    const {system} = this;

    const {cPixi, cMatrix} = system.getEnemyInfo(eEnemy);

    const view = (cPixi.pixiObject = system.getAsset(eEnemy, ENEMY, {extraData: {name: texture}}));
    view.play();

    const scaleX = width / view.width;
    const scaleY = height / view.height;

    view.scale.x = cMatrix.scaleX = scaleX;
    view.scale.y = cMatrix.scaleY = scaleY;
  }

  prepareBehaviour(eEnemy, {behaviour: {type, props}}) {
    const {system} = this;

    const {cBehaviour} = system.getEnemyInfo(eEnemy);
    cBehaviour.group = type;
    cBehaviour.data = props;
  }

  prepareMatrix(eEnemy, {behaviour: {type}}) {
    const functions = {
      [EnemyBehaviours.STATIC]: this.staticMovement,
      [EnemyBehaviours.FOLLOW]: this.followParent,
      [EnemyBehaviours.MOVE]: this.independentMovement,
      [EnemyBehaviours.TREMBLE]: this.independentTremble,
    };

    functions[type].call(this, ...arguments);
  }

  staticMovement(
    eEnemy,
    {
      y,
      behaviour: {
        props: {x, yOffset},
      },
    }
  ) {
    const {system} = this;
    const {cMatrix, view} = system.getEnemyInfo(eEnemy);

    cMatrix.y = y + yOffset;

    if (isFinite(x)) {
      const {start, end} = this.getInterval(0, 1, view.width);
      cMatrix.x = lerp(start, end, x);
      return;
    }

    if (isArray(x)) {
      const [min, max] = x;
      const {start, end} = this.getInterval(min, max, view.width);
      cMatrix.x = lerp(start, end, Math.random());
      return;
    }

    if (isObject(x)) this.independentMovement(...arguments);
  }

  followParent(
    eEnemy,
    {
      eParent,
      behaviour: {
        props: {offset},
      },
    }
  ) {
    const {system} = this;

    const {cMatrix: cParentMatrix, view} = system.getPlatformInfo(eParent);
    const {cMatrix: cEnemyMatrix} = system.getEnemyInfo(eEnemy);

    cEnemyMatrix.x = view.x = cParentMatrix.x + offset.x;
    cEnemyMatrix.y = view.y = cParentMatrix.y + offset.y;
  }

  independentMovement(
    eEnemy,
    {
      y,
      behaviour: {
        props: {x, yOffset},
      },
    }
  ) {
    const {system} = this;

    const {view, cMatrix} = system.getEnemyInfo(eEnemy);
    const {min, max, speed} = x;

    const {start, end} = this.getInterval(min, max, view.width);

    cMatrix.x = lerp(start, end, Math.random());
    cMatrix.y = y + yOffset;

    const points = [
      {x: start, y: cMatrix.y},
      {x: end, y: cMatrix.y},
      {x: cMatrix.x, y: cMatrix.y},
    ];

    const {tween, promise} = move({target: cMatrix, vars: {points, speed}});

    system.addTween(eEnemy, tween, promise, Tweens.MOVE);
  }

  independentTremble(
    eEnemy,
    {
      y,
      behaviour: {
        props: {radius, pointsCount, speed, x, yOffset},
      },
    }
  ) {
    const {system} = this;

    const {view, cMatrix} = system.getEnemyInfo(eEnemy);

    if (isFinite(x)) {
      const {start, end} = this.getInterval(0, 1, view.width);
      cMatrix.x = lerp(start, end, x);
    } else if (isArray(x)) {
      const {start, end} = this.getInterval(x[0], x[1], view.width);
      cMatrix.x = lerp(start, end, Math.random());
    }
    cMatrix.y = y + yOffset;

    const {tween, promise} = tremble({target: cMatrix, vars: {radius, pointsCount, speed}});

    system.addTween(eEnemy, tween, promise, Tweens.TREMBLE);
  }

  getInterval(min, max, width) {
    const borderLeft = width / 2;
    const borderRight = GAME_SIZE.width - width / 2;

    const worldWidth = borderRight - borderLeft;

    const minPadding = worldWidth * min;
    const maxPadding = worldWidth - worldWidth * max;

    const start = borderLeft + minPadding;
    const end = borderRight - maxPadding;

    return {start, end: end};
  }

  prepareCollider(eEnemy, {size: {width, height}, isTrackCollision}) {
    const {system} = this;
    const {cMatrix, cCollider} = system.getPlatformInfo(eEnemy);
    cCollider.collider = system.createCollider(cMatrix.x, cMatrix.y, width, height);
    cCollider.isTrackCollision = isTrackCollision;
  }

  prepareCounter(eEnemy, {count}) {
    const {system} = this;
    const {cCounter} = system.getPlatformInfo(eEnemy);
    cCounter.max = count;
  }

  prepareCombination(eEnemy, {combinationId}) {
    const {system} = this;
    const {cCombination} = system.getPlatformInfo(eEnemy);
    cCombination.combinationId = combinationId;
  }

  prepareInteractive(eEnemy) {
    const {system, eventBus} = this;

    const {cInput} = system.getCharacterInfo();

    if (cInput.process !== Input.Processes.TAP) return;

    const {view} = system.getEnemyInfo(eEnemy);

    const effect = () => {
      view.eventMode = "static";

      return eventSubscription({
        target: view,
        callbacksBus: [
          {
            event: "pointertap",
            callback({screen: {x, y}}) {
              eventBus.dispatchEvent({type: Events.CLICK, x, y, entity: eEnemy});
            },
          },
        ],
      });
    };

    system.addSideEffect({entity: eEnemy, effect});
  }
}
