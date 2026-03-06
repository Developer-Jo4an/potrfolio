import {Platform} from "../plugins/generators/Platform";
import {Enemy} from "../plugins/generators/Enemy";
import {Booster} from "../plugins/generators/Booster";
import {Helper} from "../plugins/generators/Helper";
import {Counter} from "../components/Counter";
import {hide} from "../tweens/hide";
import {fall} from "../tweens/fall";
import {randFromWeightedArray, getPluginType, initPlugins, System, PixiComponent, SatCollider} from "@shared";
import {PLATFORM} from "../entities/platform";
import {GAME_SIZE} from "../constants/game";
import {Tweens} from "../constants/tweens";
import {ENEMY} from "../entities/enemy";
import {BOOSTER} from "../entities/booster";
import {HELPER} from "../entities/helper";

export class Spawn extends System {
  init() {
    this.initPlugins();
  }

  initPlugins() {
    const {
      storage,
      storage: {engine},
      eventBus,
    } = this;

    initPlugins(
      this,
      [
        [PLATFORM, Platform],
        [ENEMY, Enemy],
        [BOOSTER, Booster],
        [HELPER, Helper],
      ],
      {storage, eventBus, system: this, engine},
    );
  }

  updateComplexity() {
    const {
      cVectorRoad: {y},
    } = this.getCharacterInfo();

    const {
      cComplexity,
      cComplexity: {
        config: {waves},
      },
    } = this.getGameInfo();

    let newComplexity = waves.findIndex(({length}, index, arr) => {
      const modulePosition = Math.abs(y);
      return modulePosition >= (arr[index - 1]?.length ?? 0) && modulePosition <= length;
    });

    if (newComplexity === -1) newComplexity = waves.length - 1;

    if (newComplexity > cComplexity.active) cComplexity.active = newComplexity;
  }

  updateComplexityCounter(id) {
    const {cComplexity} = this.getGameInfo();
    cComplexity.count++;
    cComplexity.last = id;
  }

  checkSpawnCombinations() {
    const {config, active, count} = this.getGameInfo();

    const combination = this.getWiredCombination(count + 1) ?? randFromWeightedArray(config.waves[active].combinations);

    if (!this.getIsTruthCombination(combination)) {
      this.checkSpawnCombinations(...arguments);
      return;
    }

    const distanceBetween = this.readProperty(combination.distanceBetween);

    if (!count) {
      this.createCombination(combination, GAME_SIZE.height - distanceBetween);
      this.updateComplexityCounter(combination.id);
    } else if (this.getIsCanSpawnCombination(distanceBetween, ...arguments)) {
      const lastPlatform = this.getPlatformByIndex(-1);
      const {cMatrix: cPlatformMatrix} = this.getPlatformInfo(lastPlatform);
      this.createCombination(combination, cPlatformMatrix.y - distanceBetween);
      this.updateComplexityCounter(combination.id);
      this.checkSpawnCombinations(...arguments);
    }
  }

  getIsTruthCombination(combination) {
    const {cComplexity} = this.getGameInfo();
    return combination.id !== cComplexity.last || combination.entities.some(({type}) => type === PLATFORM);
  }

  getIsCanSpawnCombination(distanceBetween, {ticks}) {
    const {
      storage: {
        mainSceneSettings: {spawnBorder},
      },
    } = this;

    const lastPlatform = this.getPlatformByIndex(-1);
    const {view: platformView} = this.getPlatformInfo(lastPlatform);
    const platformGlobal = platformView.getGlobalPosition(undefined, ticks !== 1).y;
    return platformGlobal - distanceBetween > spawnBorder;
  }

  createCombination({entities}, y) {
    const combinationId = crypto.randomUUID();

    entities.forEach((entityProps) => {
      const entity = this.spawnEntity(entityProps, combinationId, {y});

      if (!!entityProps.children?.length)
        entityProps.children.forEach((childEntityProps) => {
          this.spawnEntity(childEntityProps, combinationId, {eParent: entity});
        });
    });
  }

  spawnEntity(props, combinationId, extraProps) {
    const {plugins} = this;
    const {view: mainContainerView} = this.getMainContainerInfo();

    const plugin = plugins[getPluginType(props.type)];
    const entity = plugin.generate({...props, combinationId, ...extraProps});

    const {pixiObject: entityView} = entity.get(PixiComponent);
    mainContainerView.addChild(entityView);

    return entity;
  }

  checkDeleteCombinations() {
    const entities = [PLATFORM, ENEMY, BOOSTER, HELPER].reduce((acc, entityType) => {
      const entities = this.getEntitiesByType(entityType)?.list ?? [];
      acc.push(...entities);
      return acc;
    }, []);

    const combinations = entities.reduce((acc, ePlatform) => {
      const {cCombination} = this.getPlatformInfo(ePlatform);
      (acc[cCombination.combinationId] ??= []).push(ePlatform);
      return acc;
    }, {});

    this.deleteSpentEntities(PLATFORM);
    this.deleteSpentEntities(ENEMY);
    this.deleteInvisibleCombinations(combinations, ...arguments);
  }

  deleteSpentEntities(type) {
    const deleteFunction = {
      [PLATFORM]: this.hideSpentPlatform,
      [ENEMY]: this.hideSpentEnemy,
    }[type];

    const entities = this.getEntitiesByType(type)?.list ?? [];

    for (const entity of entities) {
      const cCounter = entity.get(Counter);
      const cCollider = entity.get(SatCollider);

      if (cCounter.current === cCounter.max && cCollider.isActive) {
        cCollider.isActive = false;
        deleteFunction.call(this, entity);
        this.deleteSpentEntities(...arguments);
      }
    }
  }

  hideSpentPlatform(ePlatform) {
    const {
      storage: {
        mainSceneSettings: {fallDistance},
      },
    } = this;
    const {view, cChild, cMatrix} = this.getPlatformInfo(ePlatform);

    const {promise: hidePromise, tween: hideTween} = hide({
      target: view,
      vars: {alpha: 0},
    });

    const {promise: fallPromise, tween: fallTween} = fall({
      target: cMatrix,
      vars: {y: cMatrix.y + fallDistance},
    });

    view.play();

    this.addTween(ePlatform, hideTween, hidePromise, Tweens.HIDE, true);
    this.addTween(ePlatform, fallTween, fallPromise, Tweens.FALL, false);

    Promise.all([hidePromise, fallPromise]).then(() => {
      cChild.childUUIDS.forEach((childUUID) => {
        const eChild = this.getEntityByUUID(childUUID);
        this.destroyEntity(eChild);
      });
      this.destroyEntity(ePlatform);
    });
  }

  hideSpentEnemy(eEnemy) {
    const {
      storage: {
        mainSceneSettings: {fallDistance},
      },
    } = this;

    const {cMatrix, cCollider} = this.getEnemyInfo(eEnemy);
    cCollider.isTrackCollision = false;

    const {tween, promise} = fall({
      target: cMatrix,
      vars: {y: cMatrix.y + fallDistance},
      callbacks: {
        onComplete() {
          this.destroyEntity(eEnemy);
        },
      },
    });

    this.addTween(eEnemy, tween, promise, Tweens.HIDE, true);
  }

  deleteInvisibleCombinations(combinations, {ticks}) {
    for (const key in combinations) {
      const combination = combinations[key];

      const isAllInvisible = combination.every((eEntity) => {
        const {pixiObject: view} = eEntity.get(PixiComponent);
        const {y: globalY} = view.getGlobalPosition(undefined, ticks !== 1);
        return globalY >= view.height / 2 + global.innerHeight;
      });

      isAllInvisible && combination.forEach((entity) => this.destroyEntity(entity));
    }
  }

  update() {
    this.updateComplexity(...arguments);
    this.checkSpawnCombinations(...arguments);
    this.checkDeleteCombinations(...arguments);
  }
}
