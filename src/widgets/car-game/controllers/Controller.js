import {Level} from "./systems/Level";
import {Utils} from "./decorators/Utils";
import {Game} from "./systems/Game";
import {Spawn} from "./systems/Spawn";
import {CollisionUtils} from "./decorators/CollisionUtils";
import {cloneDeep} from "lodash";
import {GAME_SIZE} from "./constants/game";
import {gameSpace} from "./constants/gameSpace";
import {config} from "./config/factory";
import {
  RESIZE,
  UPDATED,
  UPDATE_DECORATOR_FIELD,
  analytics,
  eventSubscription,
  getIsDebug,
  Engine,
  Collector,
  PixiRenderSystem,
  PixiSatDebugSystem,
  Assets,
  PIXIController,
  Factory,
  SatRenderSystem,
  SatCollisionSystem,
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
        {event: RESIZE, callback: this.onResized},
      ],
    });
  }

  initializationSelect() {
    if (this.isInitialized) return;
    this.onResized();
    this.initEngine();
    this.initServiceData();
    this.isInitialized = true;
  }

  playingSelect() {
    this.start();
  }

  start() {
    const {decorators} = this;
    const updateDecorator = decorators[UPDATE_DECORATOR_FIELD];
    updateDecorator.startUpdate();
  }

  stop() {
    const {decorators} = this;
    const updateDecorator = decorators[UPDATE_DECORATOR_FIELD];
    updateDecorator.stopUpdate();
  }

  initEngine() {
    const {storage, app, stage, canvas, renderer, decorators, eventBus} = this;

    const engine =
      (storage.engine =
      this.engine =
        new Engine({
          eventBus,
          storage,
          decorators: [Utils, CollisionUtils],
        }));
    storage.app = app;
    storage.eventBus = eventBus;
    storage.gameSpace = cloneDeep(gameSpace);
    storage.decorators = decorators;
    storage.stage = stage;
    storage.canvas = canvas;
    storage.renderer = renderer;

    const fullProps = {eventBus, storage};

    const systemsData = [
      {System: Assets, extraProps: {factory: new Factory({eventBus, storage, config})}},
      {System: Game},
      {System: Level},
      {System: Spawn},
      {System: SatRenderSystem},
      {System: SatCollisionSystem},
      getIsDebug() && {System: PixiSatDebugSystem},
      {System: PixiRenderSystem},
      {System: Collector},
    ].filter(Boolean);

    systemsData.forEach(({System, extraProps = {}}) => {
      engine.addSystem(new System({...fullProps, ...extraProps}));
    });
  }

  initServiceData() {
    const {storage} = this;
    storage.serviceData = {clearFunctions: []};
  }

  get isAvailableUpdate() {
    const {
      storage: {states},
      state,
    } = this;

    return states[state]?.isAvailableUpdate;
  }

  updateEngine({deltaMS, deltaTime}) {
    const {isAvailableUpdate, engine} = this;
    if (isAvailableUpdate) {
      engine.update({deltaMS, deltaTime});
    }
  }

  onUpdated() {
    this.updateEngine(...arguments);
    super.onUpdated();
  }

  onResized() {
    const {
      stage,
      $container: {offsetWidth: width, offsetHeight: height},
    } = this;

    const scale = height / GAME_SIZE.height;
    stage.scale.set(scale);

    const x = (width - GAME_SIZE.width * scale) / 2;
    const y = (height - GAME_SIZE.height * scale) / 2;
    stage.position.set(x, y);
  }

  resetEngine() {
    const {engine} = this;
    for (const key in engine.entities) {
      if (key === "game") continue;
      const collection = engine.entities[key];
      const savedList = [...collection.list];
      savedList.forEach((entity) => {
        collection.remove(entity);
        entity.destroy();
      });
      savedList.length = 0;
    }
    engine._ticks = 0;
    engine.reset();
  }

  resetServiceData() {
    const {storage} = this;
    const {
      gameSpace: {
        serviceData: {clearFunctions},
      },
    } = storage;
    clearFunctions.forEach((clear) => clear());
    clearFunctions.length = 0;
  }

  resetGameData() {
    const {storage} = this;
    storage.gameSpace = cloneDeep(gameSpace);
  }

  reset() {
    this.stop();
    this.resetEngine();
    this.resetServiceData();
    this.resetGameData();
    getIsDebug() && analytics.logStatistics();
  }
}
