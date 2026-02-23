import {ENEMY, EnemyBehaviours} from "../entities/enemy";
import {PLATFORM} from "../entities/platform";
import {Events} from "../constants/events";
import {System, eventSubscription} from "@shared";

export class Enemies extends System {
  constructor() {
    super(...arguments);

    this.onKick = this.onKick.bind(this);
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

    clearFunctions.push(
      eventSubscription({
        target: eventBus,
        callbacksBus: [{event: Events.CHARACTER_KICK_ENEMY, callback: this.onKick}],
      })
    );
  }

  onKick({enemy: eEnemy}) {
    const {cCounter} = this.getEnemyInfo(eEnemy);
    cCounter.current++;
  }

  updateEnemies() {
    const enemies = this.getEntitiesByType(ENEMY)?.list ?? [];

    const functions = {
      [EnemyBehaviours.FOLLOW]: this.handleFollowParent,
    };

    enemies.forEach(eEnemy => {
      const {cBehaviour} = this.getEnemyInfo(eEnemy);
      functions[cBehaviour.group]?.call(this, eEnemy, ...arguments);
    });
  }

  handleFollowParent(eEnemy) {
    const {cParent, cCollider} = this.getEnemyInfo(eEnemy);
    if (!cCollider.isActive || !cCollider.isTrackCollision) return;

    const eParent = this.getEntityByUUID(PLATFORM, cParent.parentUUID);

    const {cMatrix: cParentMatrix} = this.getPlatformInfo(eParent);
    const {
      cMatrix: cEnemyMatrix,
      cBehaviour: {data},
    } = this.getEnemyInfo(eEnemy);

    cEnemyMatrix.x = cParentMatrix.x + data.offset.x;
    cEnemyMatrix.y = cParentMatrix.y + data.offset.y;
  }

  update() {
    this.updateEnemies(...arguments);
  }
}
