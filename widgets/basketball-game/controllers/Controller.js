import ThreeController from "../../../shared/scene/controllers/three/ThreeController";
import Engine from "../../../shared/scene/ecs/core/Engine";
import Assets from "../../../shared/scene/ecs/base/systems/Assets";
import BasketballFactory from "./BasketballFactory";
import Collector from "../../../shared/scene/ecs/base/systems/Collector";
import Game from "./systems/Game";
import Level from "./systems/Level";
import Camera from "./systems/Camera";
import Light from "./systems/Light";
import DebugRenderer from "../../../shared/scene/debug/rapier/DebugRenderer";
import ThreeRapierRenderSystem from "../../../shared/scene/ecs/three/systems/ThreeRapierRenderSystem";
import Event from "./systems/Event";
import Interactive from "./systems/Interactive";
import Character from "./systems/Character";
import getIsDebug from "../../../shared/lib/debug/debug";
import eventSubscription from "../../../shared/lib/events/eventListener";
import {cloneDeep} from "lodash";
import {analysis} from "../../../shared/scene/analytics/Analytics";
import {UPDATED} from "../../../shared/scene/constants/events/names";
import {RESIZE} from "../../../shared/constants/events/eventsNames";
import {UPDATE_DECORATOR_FIELD} from "../../../shared/scene/constants/decorators/names";
import {BASKETBALL, GAME_SPACE} from "../constants/game";

export default class Controller extends ThreeController {
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
    this.initEngine();
    this.initWorld();
    getIsDebug() && this.initDebug();
    this.isInitialized = true;
  }

  playingSelect() {
    const {decorators, storage} = this;
    const updateDecorator = decorators[UPDATE_DECORATOR_FIELD];
    updateDecorator.startUpdate();
    getIsDebug() && (storage.debugRenderer.active = true);
  }

  initEngine() {
    const {storage, scene, renderer, camera, canvas, decorators, eventBus} = this;

    const engine = storage.engine = (this.engine = new Engine({eventBus}));
    storage.eventBus = eventBus;
    storage.scene = scene;
    storage.camera = camera;
    storage.decorators = decorators;
    storage.renderer = renderer;
    storage.canvas = canvas;
    storage.gameSpace = cloneDeep(GAME_SPACE);

    engine
    .addSystem(new Assets({eventBus, storage, factory: new BasketballFactory({eventBus, storage})}))
    .addSystem(new Level({eventBus, storage}))
    .addSystem(new Interactive({eventBus, storage}))
    .addSystem(new Character({eventBus, storage}))
    .addSystem(new Light({eventBus, storage}))
    .addSystem(new ThreeRapierRenderSystem({eventBus, storage}))
    .addSystem(new Camera({eventBus, storage}))
    .addSystem(new Event({eventBus, storage}))
    .addSystem(new Collector({eventBus, storage}))
    .addSystem(new Game({eventBus, storage}));
  }

  initWorld() {
    const {storage, storage: {mainSceneSettings: {world: {gravity}}}} = this;
    storage.world = new RAPIER3D.World(gravity);
  }

  initDebug() {
    const {storage} = this;
    storage.debugRenderer = new DebugRenderer({storage});
  }

  updateEngine({deltaTime}) {
    const {storage: {states}, state, engine} = this;
    if (states[state]?.isAvailableUpdate)
      engine.update({deltaTime});
  }

  updateWorld({deltaTime}) {
    const {storage: {world, mainSceneSettings: {world: {maxDeltaTime}}}} = this;
    world.timestep = Math.min(maxDeltaTime, deltaTime);
    world.step();
  }

  onUpdated() {
    super.onUpdated(...arguments);
    this.updateEngine(...arguments);
    this.updateWorld(...arguments);
  }

  reset() {
    const {storage, storage: {debugRenderer}} = this;

    storage.gameSpace.serviceData.clearFunctions.forEach(func => func());
    storage.gameSpace.serviceData.clearFunctions.length = 0;
    storage.gameSpace = cloneDeep(GAME_SPACE);

    gsap.localTimeline.clear(BASKETBALL);

    if (getIsDebug()) {
      debugRenderer.active = false;
      analysis.logStatistics();
    }
  }
}