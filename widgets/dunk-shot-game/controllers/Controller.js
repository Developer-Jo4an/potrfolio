import PIXIController from "../../../shared/scene/controllers/pixi/PIXIController";
import GameplayController from "./controllers/GameplayController/GameplayController";
import InteractionController from "./controllers/InteractionController/InteractionController";
import CameraController from "./controllers/CameraController/CameraController";
import EffectsController from "./controllers/EffectsController/EffectsController";
import UpdateController from "./controllers/UpdateController/UpdateController";
import CollisionObserver from "./controllers/CollisionObserver/CollisionObserver";
import {eventSubscription} from "../../../shared/lib/events/eventListener";
import {addControllerStateHandler} from "../../../shared/scene/lib/state/addControllerStateHandler";
import {RESIZE} from "../../../shared/constants/events/eventsNames";
import {UPDATED} from "../../../shared/scene/constants/events/names";
import {DUNK_SHOT_TWEEN, GAME_SIZE} from "../constants/constants";
import {DUNK_SHOT_STATE_MACHINE} from "../constants/stateMachine";
import global from "../../../shared/constants/global/global";
import {CONTROLLER_RESET, DUNK_SHOT_CONFIG_EVENT, DUNK_SHOT_GAME_DATA_EVENT} from "../constants/events";
import {dunkShotFactory} from "./factory/DunkShotFactory";
import {dunkShotAnimationPlayer} from "./animations/DunkShotAnimationPlayer";
import {dunkShotUtils} from "./utils/DunkShotUtils";
import {LEFT, RIGHT} from "../../../shared/constants/directions/directions";
import {RESET_ITEMS} from "../constants/factoryVariables";
import {gameMockConfig} from "../constants/mockLevels";

export default class Controller extends PIXIController {

  static CONTROLLERS = [
    GameplayController,
    InteractionController,
    CameraController,
    EffectsController
  ];

  controllers = [];

  groups = {};

  constructor(data) {
    super(data);

    this.onResized = this.onResized.bind(this);
    this.onUpdated = this.onUpdated.bind(this);

    return addControllerStateHandler(this, DUNK_SHOT_STATE_MACHINE);
  }

  async init() {
    this.config = gameMockConfig;
    this.config.configuration.rows.reverse();
    this.initEvents();
    await super.init();
  }

  async initializationSelect() {
    const {isInitialized} = this;

    if (!isInitialized) {
      this.onResized();
      this.initWorld();
      this.initStage();
      this.initHelpers();
      this.initWalls();
      this.initMainContainer();
      this.initLayers();
      this.initControllers();

      const {updateController} = this;
      updateController.setUpdateCallback(this.onUpdated);

      this.isInitialized = true;
    }


    this.updateController.startUpdate();
  }

  playingSelect() {
    const {updateController} = this;

    if (!updateController.isStarted)
      updateController.startUpdate();
  }

  pauseSelect() {
    const {updateController} = this;
    updateController.stopUpdate();
  }

  winSelect() {
    const {updateController} = this;
    updateController.stopUpdate();
  }

  loseSelect() {
    const {updateController} = this;
    updateController.stopUpdate();
  }

  initEvents() {
    const {eventBus} = this;

    eventSubscription({
      target: eventBus,
      callbacksBus: [
        {event: RESIZE, callback: this.onResized},
        {event: UPDATED, callback: this.onUpdated}
      ]
    });
  }

  initWorld() {
    const engine = this.engine = global.Matter.Engine.create();
    const world = this.world = engine.world;
  }

  initStage() {
    const {app} = this;

    // app.stage = new global.PIXI.layers.Stage();
    app.stage.sortableChildren = true;
  }

  initHelpers() {
    const {eventBus, config, renderer, canvas, stage, storage, state, engine, world, app, groups} = this;

    const generalData = {
      eventBus, renderer, canvas, stage, storage, state, engine, world, app, groups, config,
      gameDataEvent: DUNK_SHOT_GAME_DATA_EVENT, configEvent: DUNK_SHOT_CONFIG_EVENT
    };

    dunkShotFactory.setDefaultProperties(generalData);
    dunkShotUtils.setDefaultProperties(generalData);
    dunkShotAnimationPlayer.setDefaultProperties(generalData);
  }

  initWalls() {
    [LEFT, RIGHT].forEach(direction => {
      const wall = dunkShotFactory.createItem("wall", {direction});
      wall.addToSpaces();
    });
  }

  initMainContainer() {
    const mainContainer = dunkShotFactory.createItem("mainContainer");
    mainContainer.addToSpaces();
  }

  initLayers() {
    const {storage: {mainSceneSettings: {layers}}} = this;

    layers.forEach(({id}, index) => {
      const group = new global.PIXI.layers.Group(index, false);
      group.name = `${id}Group`;

      const layer = new global.PIXI.layers.Layer(group);
      layer.name = `${id}Layer`;

      // stage.addChild(layer);

      this.groups[id] = group;
    });
  }

  initControllers() {
    const {eventBus, renderer, config, decorators, canvas, stage, storage, state, engine, world, app, groups} = this;

    const generalData = {
      eventBus, renderer, canvas, decorators, config, stage, storage, state, engine, world, app, groups,
      gameDataEvent: DUNK_SHOT_GAME_DATA_EVENT, configEvent: DUNK_SHOT_CONFIG_EVENT
    };

    const controllers = this.controllers = Controller.CONTROLLERS.map(ControllerClass => {
      const controller = new ControllerClass(generalData);
      controller.initEvents?.();
      return controller;
    });

    controllers.forEach(controller => controller.init?.());

    this.updateController = new UpdateController({...generalData, controllers});
    this.collisionObserver = new CollisionObserver(generalData);
  }

  onResized() {
    const {stage, $container} = this;
    const {offsetWidth: width, offsetHeight: height} = $container;

    const scale = width / GAME_SIZE.width;

    stage.scale.set(scale);

    stage.position.set(
      (width - GAME_SIZE.width * scale) / 2,
      (height - GAME_SIZE.height * scale) / 2
    );
  }

  onUpdated({deltaTime}) {
    const {updateController} = this;

    super.onUpdated(deltaTime);

    updateController.update(deltaTime);
  }

  async reset() {
    const {eventBus, controllers, updateController} = this;
    const {storage, mainContainer} = dunkShotFactory;

    gsap.localTimeline.clear(DUNK_SHOT_TWEEN);

    for (const key in storage)
      RESET_ITEMS.includes(key) && storage[key].resetItems();

    mainContainer.reset();

    await Promise.all([updateController, ...controllers].map(controller => controller.reset?.() ?? Promise.resolve()));

    eventBus?.dispatchEvent({type: CONTROLLER_RESET});
  }
}