import {Input} from "../components/Input";
import {Counter} from "../components/Counter";
import {isObject, isString} from "lodash";
import {Events} from "../constants/events";
import {BULLET, BulletTextures} from "../entities/bullet";
import {CollisionGroups} from "../config/collision";
import {ENEMY} from "../entities/enemy";
import {Boosters} from "../entities/booster";
import {eventSubscription, Vector2, Matrix3Component, System, Entity} from "@shared";

export class Shoot extends System {
  constructor() {
    super(...arguments);

    this.onClick = this.onClick.bind(this);
  }

  initializationLevelSelect() {
    this.initEvents();
  }

  initEvents() {
    const {
      eventBus,
      storage: {
        serviceData: {clearFunctions},
      },
    } = this;

    const clear = eventSubscription({
      target: eventBus,
      callbacksBus: [{event: Events.CLICK, callback: this.onClick}],
    });

    clearFunctions.push(clear);
  }

  onClick() {
    const {cInput, cBooster} = this.getCharacterInfo();

    if ([Boosters.PROPELLER, Boosters.JETPACK].includes(cBooster.group)) return;

    const functions = {
      [Input.Processes.TAP]: this.onObjectClick,
      [Input.Processes.KEYBOARD]: this.onScreenClick,
      [Input.Processes.GYROSCOPE]: this.onScreenClick,
    };

    functions[cInput.process].call(this, ...arguments);
  }

  onObjectClick({entity}) {
    const {eventBus} = this;

    const eBullet = new Entity({type: BULLET, eventBus}).init();

    const {cTarget} = this.getBulletInfo(eBullet);
    cTarget.target = entity.uuid;
    cTarget.entityType = entity.type;

    this.prepareBullet(eBullet);
  }

  onScreenClick({x, y}) {
    const {eventBus} = this;

    const eBullet = new Entity({type: BULLET, eventBus}).init();
    const {cTarget} = this.getBulletInfo(eBullet);

    const {view: characterView} = this.getCharacterInfo();

    const {x: characterX, y: characterY} = characterView.getGlobalPosition();
    cTarget.target = {x: x - characterX, y: y - characterY};

    this.prepareBullet(eBullet);
  }

  prepareBullet(eBullet) {
    const {
      cPixi,
      cMatrix: cBulletMatrix,
      cCollider,
      settings: {
        size: {width, height},
      },
    } = this.getBulletInfo(eBullet);

    const {view: mainContainerView} = this.getMainContainerInfo();

    const view = (cPixi.pixiObject = this.getAsset(eBullet, BULLET, {extraData: {textureName: BulletTextures.IDLE}}));

    cBulletMatrix.scaleX = view.scale.x = width / view.width;
    cBulletMatrix.scaleY = view.scale.y = height / view.height;

    const {cMatrix: cCharacterMatrix} = this.getCharacterInfo();
    const x = (cBulletMatrix.x = view.x = cCharacterMatrix.x);
    const y = (cBulletMatrix.y = view.y = cCharacterMatrix.y);

    mainContainerView.addChild(view);

    cCollider.collider = this.createCollider(x, y, width, height);
  }

  deleteBullets() {
    const {
      storage: {stage},
    } = this;

    const bullets = this.getEntitiesByType(BULLET)?.list ?? [];

    for (const eBullet of bullets) {
      const {view} = this.getBulletInfo(eBullet);

      const {x, y} = view.getGlobalPosition(undefined, true);

      const minX = (-view.width / 2) * stage.scale.x;
      const minY = (-view.height / 2) * stage.scale.y;
      const maxX = global.innerWidth + (view.width / 2) * stage.scale.x;
      const maxY = global.innerHeight + (view.height / 2) * stage.scale.y;

      if (x <= minX || x >= maxX || y <= minY || y >= maxY) {
        this.destroyEntity(eBullet);
        this.deleteBullets();
      }
    }
  }

  updateBullets() {
    const bullets = this.getEntitiesByType(BULLET)?.list ?? [];

    bullets.forEach((eBullet) => {
      /**
       * @type {TargetValue}
       */
      const {target} = this.getBulletInfo(eBullet);

      if (isObject(target)) this.simpleFlying(eBullet, ...arguments);
      else if (isString(target)) this.followTarget(eBullet, ...arguments);
    });
  }

  simpleFlying(eBullet, {deltaS}) {
    const collisionEntitiesList = this.getCollisionEntities(eBullet, ENEMY, CollisionGroups.ENEMY);

    if (collisionEntitiesList.length) {
      this.killEntities(eBullet, collisionEntitiesList);
      return;
    }

    const {
      cMatrix,
      cTarget: {
        target: {x, y},
      },
    } = this.getBulletInfo(eBullet);

    const movingLength = this.getBulletSpeed() * deltaS;
    const {x: moveX, y: moveY} = new Vector2(x, y).setLength(movingLength);

    cMatrix.x += moveX;
    cMatrix.y += moveY;
  }

  followTarget(eBullet, {deltaS}) {
    const collisionEntitiesList = this.getCollisionEntities(eBullet, ENEMY, CollisionGroups.ENEMY);

    if (collisionEntitiesList.length) {
      this.killEntities(eBullet, collisionEntitiesList);
      return;
    }

    const {target, entityType, cMatrix: cBulletMatrix} = this.getBulletInfo(eBullet);
    const eTarget = this.getEntityByUUID(entityType, target);

    const movingLength = this.getBulletSpeed() * deltaS;

    if (!eTarget) {
      const {rotation} = cBulletMatrix;

      const xMove = movingLength * Math.cos(rotation);
      const yMove = movingLength * Math.sin(rotation);

      cBulletMatrix.x += xMove;
      cBulletMatrix.y += yMove;

      return;
    }

    const cTargetMatrix = eTarget.get(Matrix3Component);
    const betweenVector = new Vector2(cTargetMatrix.x - cBulletMatrix.x, cTargetMatrix.y - cBulletMatrix.y);

    const {x, y} = betweenVector.setLength(movingLength);
    cBulletMatrix.x += x;
    cBulletMatrix.y += y;
    cBulletMatrix.rotation = betweenVector.angle();
  }

  getBulletSpeed() {
    const {
      storage: {
        mainSceneSettings: {
          bullet: {speed},
        },
      },
    } = this;

    const {
      cBooster: {data: boosterData, group: boosterGroup},
      cHelper: {data: helperData},
    } = this.getCharacterInfo();

    return [boosterData?.jumpForceMultiplier, helperData?.jumpForceMultiplier].reduce(
      (acc, multiplier) => acc * (multiplier ?? 1),
      speed,
    );
  }

  getCollisionEntities(eBullet, type, collisionGroup) {
    const collisionEntitiesList = [];

    this.runOnCollisions(eBullet, collisionGroup, (uuid) => {
      const entity = this.getEntityByUUID(type, uuid);
      collisionEntitiesList.push(entity);
    });

    return collisionEntitiesList;
  }

  killEntities(eBullet, killEntitiesList) {
    this.destroyEntity(eBullet);

    killEntitiesList.forEach((entity) => {
      const cCounter = entity.get(Counter);
      cCounter.current++;
      cCounter.current === cCounter.max && this.destroyEntity(entity);
    });
  }

  update() {
    this.deleteBullets(...arguments);
    this.updateBullets(...arguments);
  }
}
