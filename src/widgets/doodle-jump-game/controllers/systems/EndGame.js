import {isFunction} from "lodash";
import {Events} from "../constants/events";
import {CollisionGroups} from "../config/collision";
import {ENEMY} from "../entities/enemy";
import {Behaviours} from "../constants/behaviours";
import {STATE_DECORATOR_FIELD, System} from "@shared";
import {LOSE} from "../constants/stateMachine";

export class EndGame extends System {
  constructor() {
    super(...arguments);

    this.setLose = this.setLose.bind(this);
  }

  checkLose() {
    const checkOrder = [this.checkFall, this.checkKick];
    for (const func of checkOrder) {
      const loseFunction = func.call(this, ...arguments);
      if (isFunction(loseFunction)) {
        loseFunction();
        break;
      }
    }
  }

  checkFall() {
    const {
      eventBus,
      storage: {
        mainSceneSettings: {loseBorder}
      }
    } = this;
    const {cMatrix: cCharacterMatrix} = this.getCharacterInfo();

    const firstPlatform = this.getPlatformByIndex(0);

    const {cMatrix: cPlatformMatrix} = this.getPlatformInfo(firstPlatform);

    const distanceBetween = Math.hypot(cCharacterMatrix.x - cPlatformMatrix.x, cCharacterMatrix.y - cPlatformMatrix.y);

    if (cCharacterMatrix.y > cPlatformMatrix.y && distanceBetween > loseBorder)
      return this.setLose;
  }

  checkKick() {
    const {eventBus} = this;
    const {
      cImmunity,
      entity: eCharacter,
      cPhysics,
      cCollider: {response}
    } = this.getCharacterInfo();

    if (cImmunity.isActive) return;

    const enemyCollisions = response[CollisionGroups.ENEMY];

    let isCollision = false;

    this.runOnCollisions(eCharacter, CollisionGroups.ENEMY, enemyUUID => {
      const eEnemy = this.getEntityByUUID(ENEMY, enemyUUID);
      if (!eEnemy) return;

      const {cCollider} = this.getEnemyInfo(eEnemy);
      const {response} = enemyCollisions[enemyUUID];

      if (cCollider.isTrackCollision && (response.overlapV.y < 0 || cPhysics.speedY <= 0)) {
        return (isCollision = true);
      }
    });

    if (isCollision)
      return () => {
        eventBus.dispatchEvent({
          type: Events.APPLY_BEHAVIOURS,
          config: [
            {
              type: Behaviours.APPLY_LOSE_TEXTURE,
              time: 1
            }
          ],
          resolve: this.setLose
        });
      };
  }

  setLose() {
    const {storage: {decorators}} = this;
    const stateDecorator = decorators[STATE_DECORATOR_FIELD];
    stateDecorator.state = LOSE;
  }

  update() {
    this.checkLose(...arguments);
  }
}
