import Movement from "./systems/Movement";
import PIXIController from "../../../shared/scene/controllers/pixi/PIXIController";
import Level from "./systems/Level";
import Game from "./systems/Game";
import Camera from "./systems/Camera";
import Input from "./systems/Input";
import Collision from "./systems/Collision";
import Event from "./systems/Event";
import Assets from "../../../shared/scene/ecs/base/systems/Assets";
import CarFactory from "./Factory";
import PixiRenderSystem from "../../../shared/scene/ecs/pixi/PixiRenderSystem";
import Collector from "../../../shared/scene/ecs/base/systems/Collector";
import Engine from "../../../shared/scene/ecs/core/Engine";
import {cloneDeep} from "lodash";
import getIsDebug from "../../../shared/lib/debug/debug";
import eventSubscription from "../../../shared/lib/events/eventListener";
import {GAME_SIZE, GAME_SPACE} from "../constants/game";
import {NOT_AVAILABLE_ENTITIES_TYPES_FOR_RESET} from "../constants/reset";
import {analysis} from "../../../shared/scene/analytics/Analytics";
import {UPDATE_DECORATOR_FIELD} from "../../../shared/scene/constants/decorators/names";
import {UPDATED} from "../../../shared/scene/constants/events/names";
import {RESIZE} from "../../../shared/constants/events/eventsNames";

export default class Controller extends PIXIController {
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

    const engine = storage.engine = (this.engine = new Engine({eventBus}));
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
    const {storage: {states}, state, engine} = this;
    if (states[state]?.isAvailableUpdate)
      engine.update({deltaMS, deltaTime});
  }

  onUpdated() {
    this.updateEngine(...arguments);
    super.onUpdated();
  }

  onResized() {
    const {stage, $container: {offsetWidth: width, offsetHeight: height}} = this;
    const scale = height / GAME_SIZE.height;
    stage.scale.set(scale);
    stage.position.set(
      (width - GAME_SIZE.width * scale) / 2,
      (height - GAME_SIZE.height * scale) / 2
    );
  }

  reset() {
    const {ticker} = this;
    ticker.stop();

    const {storage} = this;
    const {gameSpace: {serviceData: {clearFunctions}}} = storage;
    clearFunctions.forEach(clear => clear());
    clearFunctions.length = 0;
    storage.gameSpace = cloneDeep(GAME_SPACE);

    const {engine} = this;
    engine.reset();
    for (const key in engine.entities) {
      if (NOT_AVAILABLE_ENTITIES_TYPES_FOR_RESET.includes(key)) continue;
      const collection = engine.entities[key];
      const savedList = [...collection.list];
      savedList.forEach(entity => {
        collection.remove(entity);
        entity.destroy();
      });
      savedList.length = 0;
    }

    getIsDebug() && analysis.logStatistics();
  }
}
