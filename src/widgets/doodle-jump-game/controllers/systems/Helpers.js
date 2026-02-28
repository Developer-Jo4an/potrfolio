import {HELPER, Helpers as HelpersNamespace} from "../entities/helper";
import {PLATFORM} from "../entities/platform";
import {Events} from "../constants/events";
import {Behaviours} from "../constants/behaviours";
import {System, eventSubscription} from "@shared";

export class Helpers extends System {
  constructor() {
    super(...arguments);

    this.onCollide = this.onCollide.bind(this);
  }

  initializationLevelSelect() {
    this.initEvents();
  }

  initEvents() {
    const {
      storage: {
        serviceData: {clearFunctions},
      },
      eventBus,
    } = this;

    const clear = eventSubscription({
      target: eventBus,
      callbacksBus: [{event: Events.CHARACTER_COLLIDE_WITH_HELPER, callback: this.onCollide}],
    });

    clearFunctions.push(clear);
  }

  updateHelpers() {
    const helpers = this.getEntitiesByType(HELPER)?.list ?? [];

    helpers.forEach((eHelper) => {
      const {
        parentUUID,
        cMatrix: cHelperMatrix,
        cBehaviour: {data},
      } = this.getHelperInfo(eHelper);

      const eParent = this.getEntityByUUID(PLATFORM, parentUUID);
      const {cMatrix: cParentMatrix} = this.getPlatformInfo(eParent);

      cHelperMatrix.x = cParentMatrix.x + data.offset.x;
      cHelperMatrix.y = cParentMatrix.y + data.offset.y;
    });
  }

  onCollide({helper: eHelper}) {
    const {eventBus} = this;

    const helperInfo = this.getHelperInfo(eHelper);

    const clearHelperData = this.setHelperData(helperInfo);
    const activateHelper = this.deactivateHelper(helperInfo);

    const {resolveTime, config} = this.getHelperConfig(helperInfo);

    eventBus.dispatchEvent({
      type: Events.APPLY_BEHAVIOURS,
      config,
      resolve: () => {
        clearHelperData();
        activateHelper();
      },
      resolveTime,
    });
  }

  setHelperData({cBehaviour: {group, data}}) {
    const {cHelper} = this.getCharacterInfo();

    cHelper.group = group;
    cHelper.data = data;

    return () => {
      cHelper.group = null;
      cHelper.data = null;
    };
  }

  deactivateHelper({cCollider, cBehaviour: {group}}) {
    switch (group) {
      case HelpersNamespace.TRAMPOLINE: {
        cCollider.isTrackCollision = false;
        return () => (cCollider.isTrackCollision = true);
      }
    }
  }

  getHelperConfig({cBehaviour: {group}}) {
    const functions = {
      [HelpersNamespace.TRAMPOLINE]: this.createTrampolineConfig,
    };

    return functions[group]?.call(this, ...arguments);
  }

  createTrampolineConfig() {
    const {
      storage: {
        mainSceneSettings: {savedTimeAfterEffects},
      },
    } = this;

    const time = this.calculateJumpTime();

    return {
      resolveTime: time,
      config: [{type: Behaviours.APPLY_IMMUNITY, time: time + savedTimeAfterEffects}],
    };
  }

  update() {
    this.updateHelpers(...arguments);
  }
}
