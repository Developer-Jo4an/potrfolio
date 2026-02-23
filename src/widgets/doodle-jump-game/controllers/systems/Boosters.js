import {Spring} from "../plugins/boosters/Spring";
import {Propeller} from "../plugins/boosters/Propeller";
import {Jetpack} from "../plugins/boosters/Jetpack";
import {getPluginType, initPlugins} from "../utils/utils";
import {BOOSTER, Boosters as BoosterNamespace} from "../entities/booster";
import {PLATFORM} from "../entities/platform";
import {CollisionGroups} from "../config/collision";
import {Events} from "../constants/events";
import {System} from "@shared"

export class Boosters extends System {
  init() {
    this.initPlugins();
  }

  initPlugins() {
    const {
      eventBus,
      storage,
      storage: {engine},
    } = this;

    initPlugins(
      this,
      [
        [BoosterNamespace.SPRING, Spring],
        [BoosterNamespace.PROPELLER, Propeller],
        [BoosterNamespace.JETPACK, Jetpack],
      ],
      {
        eventBus,
        storage,
        system: this,
        engine,
      }
    );
  }

  updateBoosters() {
    const boosters = this.getEntitiesByType(BOOSTER)?.list ?? [];

    boosters.forEach(eBooster => {
      const {
        parentUUID,
        cMatrix: cBoosterMatrix,
        cBehaviour: {data},
      } = this.getBoosterInfo(eBooster);

      const eParent = this.getEntityByUUID(PLATFORM, parentUUID);
      const {cMatrix: cParentMatrix} = this.getPlatformInfo(eParent);

      cBoosterMatrix.x = cParentMatrix.x + data.offset.x;
      cBoosterMatrix.y = cParentMatrix.y + data.offset.y;
    });
  }

  checkCollision() {
    const {entity: eCharacter} = this.getCharacterInfo();

    this.runOnCollisions(eCharacter, CollisionGroups.BOOSTER, boosterUUID => {
      this.applyBooster(boosterUUID);
    });
  }

  applyBooster(boosterUUID) {
    const {eventBus} = this;

    eventBus.dispatchEvent({type: Events.CLEAR_BEHAVIOURS});

    const eBooster = this.getEntityByUUID(BOOSTER, boosterUUID);
    const boosterInfo = this.getBoosterInfo(eBooster);

    const clearBoosterData = this.setBoosterData(boosterInfo);
    const {config, resolveTime} = this.getBoosterConfig(boosterInfo);

    eventBus.dispatchEvent({
      type: Events.APPLY_BEHAVIOURS,
      config,
      resolve: clearBoosterData,
      resolveTime,
    });

    this.destroyEntity(eBooster);
  }

  setBoosterData({cBehaviour: {group, data}}) {
    const {cBooster} = this.getCharacterInfo();

    cBooster.group = group;
    cBooster.data = data;

    return () => {
      cBooster.group = null;
      cBooster.data = null;
    };
  }

  getBoosterConfig({cBehaviour: {group}}) {
    const {plugins} = this;
    const pluginType = getPluginType(group);
    return plugins[pluginType]?.createConfig(...arguments);
  }

  update() {
    this.updateBoosters(...arguments);
    this.checkCollision(...arguments);
  }
}
