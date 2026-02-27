import {Input} from "../components/Input";
import {Gyroscope} from "../plugins/controls/Gyroscope";
import {Keyboard} from "../plugins/controls/Keyboard";
import {Tap} from "../plugins/controls/Tap";
import {clamp} from "lodash";
import {CollisionGroups} from "../config/collision";
import {PLATFORM} from "../entities/platform";
import {Events} from "../constants/events";
import {ENEMY} from "../entities/enemy";
import {HELPER, Helpers} from "../entities/helper";
import {System, getPluginType, initPlugins} from "@shared";

export class Movement extends System {
  init() {
    this.initPlugins();
  }

  initPlugins() {
    const {
      storage,
      storage: {engine},
      eventBus
    } = this;

    initPlugins(
      this,
      [
        [Input.Processes.GYROSCOPE, Gyroscope],
        [Input.Processes.TAP, Tap],
        [Input.Processes.KEYBOARD, Keyboard]
      ],
      {storage, eventBus, system: this, engine}
    );
  }

  updateMovement() {
    const {plugins} = this;

    const {cInput} = this.getCharacterInfo();
    const pluginType = getPluginType(cInput.process);

    const necessaryPlugin = plugins[pluginType];

    necessaryPlugin?.updateX(...arguments);
    necessaryPlugin?.updateY(...arguments);
  }

  checkPlatformJump() {
    const {eventBus} = this;
    const {entity: eCharacter} = this.getCharacterInfo();

    let isCanJump = false;

    this.runOnCollisions(eCharacter, CollisionGroups.PLATFORM, platformUUID => {
      const isCanThrow = this.getIsTruthCollision(PLATFORM, {platformUUID});

      if (isCanThrow) {
        const collidedPlatform = this.getEntityByUUID(PLATFORM, platformUUID);
        const {cCollider} = this.getPlatformInfo(collidedPlatform);

        eventBus.dispatchEvent({
          type: Events.CHARACTER_COLLIDE_WITH_PLATFORM,
          platform: collidedPlatform
        });

        if (cCollider.isTrackCollision) {
          return (isCanJump = true);
        }
      }
    });

    return isCanJump;
  }

  checkEnemyJump() {
    const {eventBus} = this;
    const {entity: eCharacter} = this.getCharacterInfo();

    let isCanJump = false;

    this.runOnCollisions(eCharacter, CollisionGroups.ENEMY, enemyUUID => {
      const isCahThrow = this.getIsTruthCollision(ENEMY, {enemyUUID});

      if (isCahThrow) {
        eventBus.dispatchEvent({
          type: Events.CHARACTER_KICK_ENEMY,
          enemy: this.getEntityByUUID(ENEMY, enemyUUID)
        });

        return (isCanJump = true);
      }
    });

    return isCanJump;
  }

  checkHelperJump() {
    const {eventBus} = this;
    const {entity: eCharacter} = this.getCharacterInfo();

    let isCanJump = false;

    this.runOnCollisions(eCharacter, CollisionGroups.HELPER, helperUUID => {
      const isCahThrow = this.getIsTruthCollision(HELPER, {helperUUID});

      if (isCahThrow) {
        eventBus.dispatchEvent({
          type: Events.CHARACTER_COLLIDE_WITH_HELPER,
          helper: this.getEntityByUUID(HELPER, helperUUID)
        });

        return (isCanJump = true);
      }
    });

    return isCanJump;
  }

  checkJump() {
    const isPlatformJump = this.checkPlatformJump(...arguments);
    const isEnemyJump = this.checkEnemyJump(...arguments);
    const isHelperJump = this.checkHelperJump(...arguments);

    return isPlatformJump || isEnemyJump || isHelperJump;
  }

  updateVectorRoad() {
    const {storage: {gameSpace}} = this;
    const {
      cVectorRoad,
      cCollider: {prevX, x, prevY, y},
      settings: {
        updateScoreBorder
      }
    } = this.getCharacterInfo();
    const {cComplexity: {config: {target}}} = this.getGameInfo();

    if (![prevX, x, prevY, y].every(Number)) return;

    cVectorRoad.x += x - prevX;
    cVectorRoad.y += y - prevY;

    const currentScore = -cVectorRoad.y;

    if (currentScore - gameSpace.score > updateScoreBorder)
      gameSpace.score = clamp(Math.ceil(currentScore), 0, target);
  }

  getIsTruthCollision(entityType, data) {
    const functions = {
      [ENEMY]: this.onCharacterKickEnemy,
      [PLATFORM]: this.onCharacterCollideWithPlatform,
      [HELPER]: this.onCharacterCollideWithHelper
    }[entityType];

    return functions?.call(this, data);
  }

  onCharacterKickEnemy({enemyUUID}) {
    const {view, cCollider: characterCollider, cPhysics} = this.getCharacterInfo();

    const enemyCollisions = characterCollider.response[CollisionGroups.ENEMY];
    const {isCollided, response} = enemyCollisions[enemyUUID];
    if (!isCollided) return false;

    const enemies = this.getEntitiesByType(ENEMY)?.list ?? [];
    const eEnemy = enemies.find(({uuid}) => uuid === enemyUUID);
    if (!eEnemy) return false;

    const {cCollider: enemyCollider} = this.getEnemyInfo(eEnemy);

    return (
      characterCollider.isTrackCollision &&
      enemyCollider.isTrackCollision &&
      response.overlapV.y > 0 &&
      response.overlapV.len() < view.height / 2 &&
      cPhysics.speedY > 0
    );
  }

  onCharacterCollideWithPlatform({platformUUID}) {
    const {
      settings: {
        collision: {
          platform: {overlapLength}
        }
      },
      cCollider: characterCollider,
      cPhysics,
      response
    } = this.getCharacterInfo();

    const {response: collisionData} = response[CollisionGroups.PLATFORM][platformUUID];

    return (
      characterCollider.isTrackCollision &&
      cPhysics.speedY >= 0 &&
      collisionData.overlapV.y > 0 &&
      collisionData.overlapV.len() <= overlapLength
    );
  }

  onCharacterCollideWithHelper({helperUUID}) {
    const {cCollider: cCharacterCollider, cPhysics, response} = this.getCharacterInfo();

    const {response: collisionData} = response[CollisionGroups.HELPER][helperUUID];

    const eHelper = this.getEntityByUUID(HELPER, helperUUID);
    const {
      cBehaviour: {group},
      cCollider: cHelperCollider
    } = this.getHelperInfo(eHelper);

    switch (group) {
      case Helpers.TRAMPOLINE: {
        return (
          cCharacterCollider.isTrackCollision &&
          cHelperCollider.isTrackCollision &&
          cPhysics.speedY >= 0 &&
          collisionData.overlapV.y > 0
        );
      }
    }

    return false;
  }

  update() {
    const isJumped = this.checkJump();

    const fullProps = {...arguments[0], isJumped};

    this.updateMovement(fullProps);
    this.updateVectorRoad(fullProps);
  }
}
