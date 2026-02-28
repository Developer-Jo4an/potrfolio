import {Immunity} from "../plugins/behaviours/Immunity";
import {SpringTexture} from "../plugins/behaviours/SpringTexture";
import {PropellerTexture} from "../plugins/behaviours/PropellerTexture";
import {DisableCollisions} from "../plugins/behaviours/DisableCollisions";
import {JetpackTexture} from "../plugins/behaviours/JetpackTexture";
import {LoseTexture} from "../plugins/behaviours/LoseTexture";
import {v4 as uuidv4} from "uuid";
import {Events} from "../constants/events";
import {Behaviours} from "../constants/behaviours";
import {System, getPluginType, initPlugins, eventSubscription} from "@shared";

export class Behaviour extends System {
  behavioursData = {};

  resolvers = {};

  constructor() {
    super(...arguments);

    this.clearBehaviours = this.clearBehaviours.bind(this);
    this.applyBehaviours = this.applyBehaviours.bind(this);
  }

  init() {
    const {
      eventBus,
      storage,
      storage: {engine},
    } = this;

    initPlugins(
      this,
      [
        [Behaviours.APPLY_IMMUNITY, Immunity],
        [Behaviours.APPLY_SPRING_TEXTURE, SpringTexture],
        [Behaviours.APPLY_PROPELLER_TEXTURE, PropellerTexture],
        [Behaviours.APPLY_LOSE_TEXTURE, LoseTexture],
        [Behaviours.APPLY_JETPACK_TEXTURE, JetpackTexture],
        [Behaviours.DISABLE_COLLISIONS, DisableCollisions],
      ],
      {
        eventBus,
        storage,
        system: this,
        engine,
      },
    );
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
      callbacksBus: [
        {event: Events.CLEAR_BEHAVIOURS, callback: this.clearBehaviours},
        {event: Events.APPLY_BEHAVIOURS, callback: this.applyBehaviours},
      ],
    });

    clearFunctions.push(clear);
  }

  applyBehaviours({config, resolve, resolveTime}) {
    const {resolvers, behavioursData} = this;

    config.forEach(({type, time}) => {
      if (!!behavioursData[type]) {
        const behaviour = behavioursData[type];
        if (time > behaviour.time) behaviour.time = time;
      } else {
        const behaviour = (behavioursData[type] = {time});

        const clearBehaviour = this.applyBehaviour(type);

        behaviour.clear = () => {
          clearBehaviour();
          delete behavioursData[type];
        };
      }
    });

    resolvers[uuidv4()] = {
      time: resolveTime ?? config.reduce((acc, {time}) => Math.max(time, acc), -Infinity),
      clear: resolve,
    };
  }

  applyBehaviour(type) {
    const {plugins} = this;
    const pluginType = getPluginType(type);
    const plugin = plugins[pluginType];
    return plugin?.apply();
  }

  clearBehaviours() {
    this.clearObject("behavioursData");
    this.clearObject("resolvers");
  }

  clearObject(key) {
    const {[key]: object} = this;
    for (const key in object) {
      const {clear} = object[key];
      clear();
    }
    this[key] = {};
  }

  updateTimers() {
    const {behavioursData, resolvers} = this;

    this.onTick(behavioursData, ...arguments);
    this.onTick(resolvers, ...arguments);
  }

  onTick(object, {deltaS}) {
    const {
      storage: {
        mainSceneSettings: {timeScale},
      },
    } = this;

    const truthDeltaS = deltaS / timeScale;

    const clearFunctions = [];

    for (const key in object) {
      const data = object[key];
      data.time = Math.max(0, data.time - truthDeltaS);
      !data.time && clearFunctions.push(data.clear);
    }

    clearFunctions.forEach((clear) => clear());
  }

  update() {
    this.updateTimers(...arguments);
  }

  reset() {
    this.behavioursData = {};
    this.resolvers = {};
    super.reset();
  }
}
