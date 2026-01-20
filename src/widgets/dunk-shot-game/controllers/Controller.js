import {GameplayController} from "./controllers/GameplayController/GameplayController";
import {InteractionController} from "./controllers/InteractionController/InteractionController";
import {CameraController} from "./controllers/CameraController/CameraController";
import {EffectsController} from "./controllers/EffectsController/EffectsController";
import {CollisionObserver} from "./controllers/CollisionObserver/CollisionObserver";
import {
  PIXIController,
  Resize,
  AppState as State,
  Performance,
  PIXIMatterUpdate,
  eventSubscription,
  getIsDebug,
  addControllerStateHandler,
  RESIZE,
  UPDATED,
  LEFT,
  RIGHT,
  PERFORMANCE_DECORATOR_FIELD,
  RESIZE_DECORATOR_FIELD,
  STATE_DECORATOR_FIELD,
  UPDATE_DECORATOR_FIELD,
  PAUSED,
} from "@shared";
import {DUNK_SHOT_TWEEN, GAME_SIZE} from "../constants";
import {DUNK_SHOT_STATE_MACHINE} from "../constants/stateMachine";
import {CONTROLLER_RESET, DUNK_SHOT_CONFIG_EVENT, DUNK_SHOT_GAME_DATA_EVENT} from "../constants/events";
import {dunkShotFactory} from "./factory/DunkShotFactory";
import {dunkShotAnimationPlayer} from "./animations/DunkShotAnimationPlayer";
import {dunkShotUtils} from "./utils/DunkShotUtils";
import {RESET_ITEMS} from "../constants/factoryVariables";

export class Controller extends PIXIController {
  CONTROLLERS = [GameplayController, InteractionController, CameraController, EffectsController];

  controllers = [];

  DECORATORS = [
    {DecoratorClass: PIXIMatterUpdate, decoratorField: UPDATE_DECORATOR_FIELD},
    {DecoratorClass: Resize, decoratorField: RESIZE_DECORATOR_FIELD},
    {DecoratorClass: State, decoratorField: STATE_DECORATOR_FIELD},
    getIsDebug() && {DecoratorClass: Performance, decoratorField: PERFORMANCE_DECORATOR_FIELD},
  ].filter(Boolean);

  groups = {};

  constructor(data) {
    super(data);

    this.onResized = this.onResized.bind(this);
    this.onUpdated = this.onUpdated.bind(this);

    this.initEvents();

    return addControllerStateHandler(this, DUNK_SHOT_STATE_MACHINE);
  }

  async init() {
    await super.init();
  }

  async initializationSelect() {
    const {app, isInitialized} = this;

    if (!isInitialized) {
      this.onResized();
      this.initWorld();
      this.initStage();
      this.initHelpers();
      this.initWalls();
      this.initMainContainer();
      this.initLayers();
      this.initControllers();
      this.isInitialized = true;
    }

    this.startUpdate();
  }

  playingSelect() {
    this.startUpdate();
  }

  pauseSelect() {
    this.stopUpdate();
  }

  winSelect() {
    this.stopUpdate();
  }

  loseSelect() {
    this.stopUpdate();
  }

  stopUpdate() {
    const {decorators} = this;

    const updateDecorator = decorators[UPDATE_DECORATOR_FIELD];
    updateDecorator.stopUpdate();
    gsap.localTimeline.pause(DUNK_SHOT_TWEEN);
  }

  startUpdate() {
    const {decorators} = this;

    const updateDecorator = decorators[UPDATE_DECORATOR_FIELD];

    if (!updateDecorator.isStarted) updateDecorator.startUpdate();

    if (gsap.localTimeline.getStatusByNamespace(DUNK_SHOT_TWEEN) === PAUSED) gsap.localTimeline.play(DUNK_SHOT_TWEEN);
  }

  initEvents() {
    const {eventBus} = this;

    eventSubscription({
      target: eventBus,
      callbacksBus: [
        {event: RESIZE, callback: this.onResized},
        {event: UPDATED, callback: this.onUpdated},
        {event: DUNK_SHOT_GAME_DATA_EVENT, callback: ({gameData}) => (this.gameData = gameData)},
        {event: DUNK_SHOT_CONFIG_EVENT, callback: ({config}) => (this.config = config)},
      ],
    });
  }

  initWorld() {
    const engine = (this.engine = Matter.Engine.create());
    const world = (this.world = engine.world);
  }

  initStage() {
    const {app} = this;

    app.stage.sortableChildren = true;
  }

  initHelpers() {
    const {generalData} = this;

    dunkShotFactory.setDefaultProperties(generalData);
    dunkShotUtils.setDefaultProperties(generalData);
    dunkShotAnimationPlayer.setDefaultProperties(generalData);
  }

  initWalls() {
    [LEFT, RIGHT].forEach((direction) => {
      const wall = dunkShotFactory.createItem("wall", {direction});
      wall.addToSpaces();
    });
  }

  initMainContainer() {
    const mainContainer = dunkShotFactory.createItem("mainContainer");
    mainContainer.addToSpaces();
  }

  initLayers() {
    const {
      stage,
      groups,
      storage: {
        mainSceneSettings: {layers},
      },
    } = this;

    layers.forEach(({id}) => {
      const layer = (groups[id] = new PIXI.RenderLayer({sortableChildren: true}));
      layer.label = `${id}Layer`;
      stage.addChild(layer);
    });
  }

  initControllers() {
    const {CONTROLLERS, generalData} = this;

    const controllers = (this.controllers = CONTROLLERS.map((ControllerClass) => {
      const controller = new ControllerClass(generalData);
      controller.initEvents?.();
      return controller;
    }));

    controllers.forEach((controller) => controller.init?.());

    this.collisionObserver = new CollisionObserver(generalData);
  }

  get generalData() {
    const {
      eventBus,
      config,
      gameData,
      decorators,
      renderer,
      canvas,
      stage,
      storage,
      state,
      engine,
      world,
      app,
      groups,
    } = this;

    return {
      eventBus,
      renderer,
      canvas,
      decorators,
      stage,
      storage,
      state,
      engine,
      world,
      app,
      groups,
      config,
      gameData,
    };
  }

  onResized() {
    const {
      stage,
      $container: {offsetWidth: width, offsetHeight: height},
    } = this;

    const scale = width / GAME_SIZE.width; // Игра вписана по ширине

    stage.scale.set(scale);

    stage.position.set((width - GAME_SIZE.width * scale) / 2, (height - GAME_SIZE.height * scale) / 2);
  }

  onUpdated({deltaMS, deltaTime}) {
    const {state, controllers, engine, stateMachine} = this;

    super.onUpdated(deltaTime);

    if (!stateMachine[state]?.isAvailableUpdate) return;

    controllers.forEach((controller) => controller?.update?.(deltaMS, deltaTime));
    Matter.Engine.update(engine, deltaMS);
  }

  async reset() {
    const {eventBus, decorators, controllers} = this;
    const {storage} = dunkShotFactory;

    gsap.localTimeline.clear(DUNK_SHOT_TWEEN);

    for (const key in storage) RESET_ITEMS.includes(key) && storage[key].resetItems();

    const arrayDecorators = Object.values(decorators);
    const toReset = [...arrayDecorators, ...controllers];
    await Promise.all(toReset.map((item) => item.reset?.() ?? Promise.resolve()));

    eventBus.dispatchEvent({type: CONTROLLER_RESET});
  }
}
