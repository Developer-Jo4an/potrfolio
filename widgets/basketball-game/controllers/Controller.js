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
import Collision from "./systems/Collision";
import CameraFlying from "../../../shared/scene/debug/three/CameraFlying";
import getIsDebug from "../../../shared/lib/debug/debug";
import eventSubscription from "../../../shared/lib/events/eventListener";
import {analysis} from "../../../shared/scene/analytics/Analytics";
import {UPDATED} from "../../../shared/scene/constants/events/names";
import {RESIZE} from "../../../shared/constants/events/eventsNames";
import {UPDATE_DECORATOR_FIELD} from "../../../shared/scene/constants/decorators/names";
import {BASKETBALL} from "../constants/game";
import gameSpaceStore from "../model/storages/gameSpace";

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

  async initializationSelect() {
    if (this.isInitialized) return;
    this.initEngine();
    this.initWorld();
    if (getIsDebug())
      await this.initDebug();
    this.isInitialized = true;
  }

  playingSelect() {
    const {decorators, storage} = this;
    const updateDecorator = decorators[UPDATE_DECORATOR_FIELD];
    updateDecorator.startUpdate();

    if (getIsDebug()) {
      storage.debugRenderer.isActive = true;
      storage.cameraFlying.isActive = true;
    }
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
    storage.gameSpace = {
      get: gameSpaceStore.getSnapshot,
      set: gameSpaceStore.set,
      reset: gameSpaceStore.reset
    };
    storage.eventQueue = new RAPIER3D.EventQueue(true);

    engine
    .addSystem(new Assets({eventBus, storage, factory: new BasketballFactory({eventBus, storage})}))
    .addSystem(new Level({eventBus, storage}))
    .addSystem(new Interactive({eventBus, storage}))
    .addSystem(new Collision({eventBus, storage}))
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

  async initDebug() {
    const {storage} = this;
    const debugRenderer = storage.debugRenderer = new DebugRenderer({storage});
    const cameraFlying = storage.cameraFlying = new CameraFlying({storage});
    await cameraFlying.init();
  }

  updateEngine({deltaTime}) {
    const {storage: {states}, state, engine} = this;
    if (states[state]?.isAvailableUpdate)
      engine.update({deltaTime});
  }

  updateWorld({deltaTime}) {
    const {storage: {world, eventQueue, mainSceneSettings: {world: {maxDeltaTime}}}} = this;
    world.timestep = Math.min(maxDeltaTime, deltaTime);
    world.step(eventQueue);
  }

  onUpdated() {
    super.onUpdated(...arguments);
    this.updateEngine(...arguments);
    this.updateWorld(...arguments);
  }

  reset() {
    const {storage, storage: {gameSpace: {get, reset, set}, eventQueue, debugRenderer, cameraFlying}} = this;

    const gameSpace = get();
    gameSpace.serviceData.clearFunctions.forEach(func => func());
    set(({serviceData: {clearFunctions}}) => clearFunctions.length = 0);
    reset();

    eventQueue.free();
    eventQueue.clear();
    storage.eventQueue = null;

    gsap.localTimeline.clear(BASKETBALL);

    if (getIsDebug()) {
      debugRenderer.isActive = false;
      cameraFlying.isActive = false;
      analysis.logStatistics();
    }
  }
}