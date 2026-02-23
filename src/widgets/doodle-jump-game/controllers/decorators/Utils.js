import {Decorator, State, Matrix3Component, Tween, PixiComponent, SatCollider} from "@shared";
import {Complexity} from "../components/Complexity";
import {Parent} from "../components/Parent";
import {Child} from "../components/Child";
import {Target} from "../components/Target";
import {isArray} from "lodash";
import {CHARACTER} from "../entities/character";
import {MAIN_CONTAINER} from "../entities/mainContainer";
import {GAME} from "../constants/game";

export class Utils extends Decorator {
  /**
   * shortcuts
   */
  getInfo(entity) {
    const {
      storage: {mainSceneSettings}
    } = this;

    return entity.children.reduce(
      (acc, child) => {
        const ParentClass = child.constructor;

        switch (ParentClass) {
          case PixiComponent: {
            acc.cPixi = child;
            const {pixiObject: view} = child;
            acc.view = view;
            return acc;
          }

          case SatCollider: {
            acc.cCollider = child;
            const {collider, response} = child;
            acc.collider = collider;
            acc.response = response;
            return acc;
          }

          case Matrix3Component: {
            acc.cMatrix = child;
            return acc;
          }

          case Complexity: {
            acc.cComplexity = child;
            const {config, active, count, last} = child;
            acc.config = config;
            acc.active = active;
            acc.count = count;
            acc.last = last;
            return acc;
          }

          case State: {
            acc.cState = child;
            const {state} = child;
            acc.state = state;
            return acc;
          }

          case Parent: {
            acc.cParent = child;
            const {parentUUID} = child;
            acc.parentUUID = parentUUID;
            return acc;
          }

          case Target: {
            acc.cTarget = child;
            const {target, entityType} = child;
            acc.target = target;
            acc.entityType = entityType;
            return acc;
          }

          case Child: {
            acc.cChild = child;
            const {childUUIDS} = child;
            acc.childUUIDS = childUUIDS;
            return acc;
          }

          default: {
            const field = `c${ParentClass.name}`;
            acc[field] = child;
            return acc;
          }
        }
      },
      {entity, settings: mainSceneSettings[entity.type]}
    );
  }

  getCharacterInfo() {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    return this.getInfo(eCharacter);
  }

  getPlatformInfo(ePlatform) {
    return this.getInfo(ePlatform);
  }

  getMainContainerInfo() {
    const eMainContainer = this.getFirstEntityByType(MAIN_CONTAINER);
    return this.getInfo(eMainContainer);
  }

  getGameInfo() {
    const eGame = this.getFirstEntityByType("game");
    return this.getInfo(eGame);
  }

  getEnemyInfo(eEnemy) {
    return this.getInfo(eEnemy);
  }

  getBulletInfo(eBullet) {
    return this.getInfo(eBullet);
  }

  getBoosterInfo(eBooster) {
    return this.getInfo(eBooster);
  }

  getHelperInfo(eHelper) {
    return this.getInfo(eHelper);
  }

  /**
   * other
   */
  destroyEntity(entity) {
    if (!entity) return;

    const cTween = entity.get(Tween);
    cTween && this.clearAllTweens(cTween);

    const cParent = entity.get(Parent);
    cParent && this.clearParent(entity, cParent);

    const cChild = entity.get(Child);
    cChild && this.clearChild(entity, cChild);

    entity.destroy();
  }

  clearAllTweens(cTween) {
    const {tweens} = cTween;
    for (const tween of tweens.values()) tween.delete(GAME);
    cTween.removeAll();
  }

  clearParent(entity, cParent) {
    const eParent = this.getEntityByUUID(cParent.parentUUID);

    if (!eParent) {
      cParent.parentUUID = null;
      return;
    }

    const cChild = eParent.get(Child);
    const {childUUIDS} = cChild;
    isArray(childUUIDS) && childUUIDS.splice(childUUIDS.indexOf(entity.uuid), 1);

    cParent.parentUUID = null;
  }

  clearChild(entity, cParent) {
    const {childUUIDS} = cParent;
    if (!isArray(childUUIDS)) return;

    childUUIDS.forEach(childUUID => {
      const eChild = this.getEntityByUUID(childUUID);
      if (!eChild) return;

      const cParent = eChild.get(Parent);
      if (!cParent) return;

      cParent.parentUUID = null;
    });
  }
}
