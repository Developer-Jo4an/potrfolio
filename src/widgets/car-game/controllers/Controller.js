import {Movement} from "./systems/Movement";
import {Level} from "./systems/Level";
import {Game} from "./systems/Game";
import {Camera} from "./systems/Camera";
import {Input} from "./systems/Input";
import {Collision} from "./systems/Collision";
import {Event} from "./systems/Event";
import {CarFactory} from "./Factory";
import {cloneDeep} from "lodash";
import {GAME_SIZE, GAME_SPACE} from "../constants/game";
import {NOT_AVAILABLE_ENTITIES_TYPES_FOR_RESET} from "../constants/reset";
import {
  RESIZE,
  UPDATED,
  UPDATE_DECORATOR_FIELD,
  analysis,
  eventSubscription,
  getIsDebug,
  Engine,
  Collector,
  PixiRenderSystem,
  Assets,
  PIXIController
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

  initializationSelect() {
    if (this.isInitialized) return;
    this.onResized();
    this.initEngine();
    this.isInitialized = true;
  }

  playingSelect() {
    const {decorators} = this;
    const updateDecorator = decorators[UPDATE_DECORATOR_FIELD];
    updateDecorator.startUpdate();
  }

  initEngine() {
    const {storage, app, stage, canvas, renderer, decorators, eventBus} = this;

    const engine = (storage.engine = this.engine = new Engine({eventBus}));
    storage.app = app;
    storage.eventBus = eventBus;
    storage.gameSpace = cloneDeep(GAME_SPACE);
    storage.decorators = decorators;
    storage.stage = stage;
    storage.canvas = canvas;
    storage.renderer = renderer;

    engine
    .addSystem(new Assets({eventBus, storage, factory: new CarFactory({eventBus, storage})}))
    .addSystem(new Game({eventBus, storage}))
    .addSystem(new Input({eventBus, storage}))
    .addSystem(new Level({eventBus, storage}))
    .addSystem(new Movement({eventBus, storage}))
    .addSystem(new Collision({eventBus, storage}))
    .addSystem(new PixiRenderSystem({eventBus, storage}))
    .addSystem(new Camera({eventBus, storage}))
    .addSystem(new Event({eventBus, storage}))
    .addSystem(new Collector({eventBus, storage}));
  }

  updateEngine({deltaMS, deltaTime}) {
    const {
      storage: {states},
      state,
      engine
    } = this;
    if (states[state]?.isAvailableUpdate) engine.update({deltaMS, deltaTime});
  }

  onUpdated() {
    this.updateEngine(...arguments);
    super.onUpdated();
  }

  onResized() {
    const {
      stage,
      $container: {offsetWidth: width, offsetHeight: height}
    } = this;
    const scale = height / GAME_SIZE.height;
    stage.scale.set(scale);
    stage.position.set((width - GAME_SIZE.width * scale) / 2, (height - GAME_SIZE.height * scale) / 2);
  }

  reset() {
    const {decorators} = this;
    const updateDecorator = decorators[UPDATE_DECORATOR_FIELD];
    updateDecorator.stopUpdate();

    const {storage} = this;
    const {
      gameSpace: {
        serviceData: {clearFunctions}
      }
    } = storage;
    clearFunctions.forEach((clear) => clear());
    clearFunctions.length = 0;
    storage.gameSpace = cloneDeep(GAME_SPACE);

    const {engine} = this;
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

    getIsDebug() && analysis.logStatistics();
  }
}
