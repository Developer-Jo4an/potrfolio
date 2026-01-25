import {TileExplorerFactory} from "./Factory";
import {Game} from "./systems/Game";
import {Level} from "./systems/Level";
import {AbstractTree} from "./systems/AbstractTree";
import {gameSpaceStore} from "../model/storages/gameSpace";
import {NOT_AVAILABLE_ENTITIES_TYPES_FOR_RESET} from "../constants/reset";
import {TILE_EXPLORER, GAME_SIZE} from "../constants/game";
import {
  UPDATE_DECORATOR_FIELD,
  RESIZE,
  UPDATED,
  analysis,
  eventSubscription,
  getIsDebug,
  Collector,
  Assets,
  Engine,
  PIXIController,
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

  async initializationSelect() {
    if (this.isInitialized) return;
    this.initEngine();
    this.isInitialized = true;
  }

  playingSelect() {
    this.start();
  }

  pausedSelect() {
    this.stop();
  }

  initEngine() {
    const {storage, app, stage, ticker, renderer, canvas, decorators, eventBus} = this;

    const engine = (storage.engine = this.engine = new Engine({eventBus}));
    storage.eventBus = eventBus;
    storage.decorators = decorators;
    storage.gameSpace = gameSpaceStore;
    storage.app = app;
    storage.stage = stage;
    storage.ticker = ticker;
    storage.renderer = renderer;
    storage.canvas = canvas;

    engine
      .addSystem(new Assets({eventBus, storage, factory: new TileExplorerFactory({eventBus, storage})}))
      .addSystem(new AbstractTree({eventBus, storage}))
      .addSystem(new Level({eventBus, storage}))
      .addSystem(new Collector({eventBus, storage}))
      .addSystem(new Game({eventBus, storage}));
  }

  updateEngine({deltaTime, deltaMS}) {
    const {engine} = this;
    engine.update({deltaTime, deltaMS});
  }

  get isAvailableUpdate() {
    const {
      storage: {states},
      state,
    } = this;
    return !!states[state]?.isAvailableUpdate;
  }

  onResized() {
    const {
      stage,
      $container: {offsetWidth: width, offsetHeight: height},
    } = this;
    const scale = Math.min(width / GAME_SIZE.width, height / GAME_SIZE.height);
    stage.scale.set(scale);
    stage.position.set((width - GAME_SIZE.width * scale) / 2, (height - GAME_SIZE.height * scale) / 2);
  }

  onUpdated() {
    if (!this.isAvailableUpdate) return;
    super.onUpdated(...arguments);
    this.updateEngine(...arguments);
  }

  start() {
    const {decorators} = this;
    const updateDecorator = decorators[UPDATE_DECORATOR_FIELD];
    updateDecorator.startUpdate();
    gsap.localTimeline.play(TILE_EXPLORER);
  }

  stop() {
    const {decorators} = this;
    const updateDecorator = decorators[UPDATE_DECORATOR_FIELD];
    updateDecorator.stopUpdate();
    gsap.localTimeline.pause(TILE_EXPLORER);
  }

  reset() {
    this.stop();

    gsap.localTimeline.clear(TILE_EXPLORER);

    const {
      storage: {
        gameSpace: {get, reset, set},
      },
    } = this;
    const gameSpace = get();
    gameSpace.serviceData.clearFunctions.forEach((func) => func());
    set(({serviceData: {clearFunctions}}) => (clearFunctions.length = 0));
    reset();

    const {
      storage: {engine},
    } = this;
    engine.reset();

    for (const key in engine.entities) {
      if (NOT_AVAILABLE_ENTITIES_TYPES_FOR_RESET.includes(key)) continue;
      const collection = engine.entities[key];
      const savedList = [...collection.list];
      savedList.forEach((entity) => {
        collection.remove(entity);
        entity.destroy();
      });
      savedList.length = 0;
    }

    if (getIsDebug()) analysis.logStatistics();
  }
}
