import {Game} from "./systems/Game";
import {Level} from "./systems/Level";
import {Tree} from "./systems/Tree";
import {Interactive} from "./systems/Interactive";
import {Boosters} from "./systems/Boosters";
import {Animations} from "./systems/Animations";
import {Time} from "./systems/Time";
import {Utils} from "./decorators/Utils";
import {Effects} from "./systems/Effects";
import {GAME_SIZE, GAME} from "./constants/game";
import {statesData} from "./constants/state";
import {LOSE, WIN} from "./constants/stateMachine";
import {Events} from "./constants/events";
import {config} from "./assets/config";
import {
  Engine,
  Factory,
  PIXIController,
  PixiRenderSystem,
  Assets,
  Collector,
  getIsDebug,
  eventSubscription,
  analytics,
  UPDATE_DECORATOR_FIELD,
  UPDATED,
  RESIZE
} from "@shared";

export class Controller extends PIXIController {
  constructor() {
    super(...arguments);

    this.onUpdated = this.onUpdated.bind(this);
    this.onResized = this.onResized.bind(this);
  }

  async init() {
    await super.init();
    this.initEvents();
  }

  initEvents() {
    const {eventBus} = this;
    eventSubscription({
      target: eventBus,
      callbacksBus: [
        {event: UPDATED, callback: this.onUpdated},
        {event: RESIZE, callback: this.onResized}
      ]
    });
  }

  async initializationSelect() {
    if (this._isInitialized) return;
    this.initEngine();
    this.initServiceData();
    this._isInitialized = true;
  }

  playingSelect() {
    this.start();
  }

  pausedSelect() {
    this.stop();
  }

  losingSelect() {
    return this.waitPromises();
  }

  loseSelect() {
    this.eventBus.dispatchEvent({type: Events.LOSE, status: LOSE});
  }

  winningSelect() {
    return this.waitPromises();
  }

  winSelect() {
    this.eventBus.dispatchEvent({type: Events.WIN, status: WIN});
  }

  waitPromises() {
    const {
      storage: {
        mainSceneSettings: {engGameWaiting}
      }
    } = this;

    return new Promise(res => setTimeout(res, engGameWaiting));
  }

  initEngine() {
    const {storage, app, stage, decorators, renderer, canvas, eventBus} = this;

    const engine = (storage.engine = this.engine = new Engine({eventBus, storage, decorators: [Utils]}));
    storage.eventBus = eventBus;
    storage.app = app;
    storage.decorators = decorators;
    storage.stage = stage;
    storage.renderer = renderer;
    storage.canvas = canvas;

    const fullProps = {eventBus, storage, factory: new Factory({defaultProperties: {eventBus, storage}, config})};

    const systemClasses = [
      Assets,
      Tree,
      Level,
      Interactive,
      Boosters,
      Animations,
      Effects,
      PixiRenderSystem,
      Time,
      Game,
      Collector
    ];

    systemClasses.forEach(System => {
      const system = new System(fullProps);
      engine.addSystem(system);
    });
  }

  initServiceData() {
    const {storage} = this;
    storage.serviceData = {clearFunctions: []};
  }

  updateEngine({deltaTime, deltaMS}) {
    const {engine} = this;
    engine.update({deltaTime, deltaMS});
  }

  start() {
    const {decorators} = this;
    const updateDecorator = decorators[UPDATE_DECORATOR_FIELD];
    updateDecorator.startUpdate();
    gsap.localTimeline.play(GAME);
  }

  stop() {
    const {decorators} = this;
    const updateDecorator = decorators[UPDATE_DECORATOR_FIELD];
    updateDecorator.stopUpdate();
    gsap.localTimeline.play(GAME);
  }

  get isAvailableUpdate() {
    const {state} = this;
    return statesData.availableUpdate.includes(state);
  }

  onUpdated() {
    if (this.isAvailableUpdate) {
      this.updateEngine(...arguments);
      super.onUpdated();
    }
  }

  onResized() {
    const {
      stage,
      $container: {offsetWidth: width, offsetHeight: height}
    } = this;

    const scale = Math.min(width / GAME_SIZE.width, height / GAME_SIZE.height);
    stage.scale.set(scale);

    const x = (width - GAME_SIZE.width * scale) / 2;
    const y = (height - GAME_SIZE.height * scale) / 2;
    stage.position.set(x, y);
  }

  resetUpdate() {
    this.stop();
    gsap.localTimeline.clear(GAME);
  }

  resetServiceData() {
    const {
      storage: {serviceData}
    } = this;

    if (serviceData) {
      const {clearFunctions} = serviceData;
      clearFunctions.forEach(func => func());
      clearFunctions.length = 0;
    }
  }

  resetGameStore() {
    const {
      storage,
      storage: {gameStore}
    } = this;

    if (gameStore) {
      gameStore.reset();
      storage.gameSpace = gameStore.gameSpace;
    }
  }

  resetEngine() {
    const {
      storage: {engine}
    } = this;

    if (!engine) return;

    for (const key in engine.entities) {
      if (key === "game") continue;
      const collection = engine.entities[key];
      const savedList = [...collection.list];
      savedList.forEach(entity => {
        entity.destroy();
        collection.remove(entity);
      });
      savedList.length = 0;
    }
    engine._ticks = 0;
    engine.reset();
  }

  reset() {
    this.resetUpdate();
    this.resetServiceData();
    this.resetGameStore();
    this.resetEngine();
    getIsDebug() && analytics.logStatistics();
  }
}

