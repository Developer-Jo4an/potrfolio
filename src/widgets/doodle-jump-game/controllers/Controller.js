import {Game} from "./systems/Game";
import {Level} from "./systems/Level";
import {Utils} from "./decorators/Utils";
import {Movement} from "./systems/Movement";
import {Interactive} from "./systems/Interactive";
import {Spawn} from "./systems/Spawn";
import {Camera} from "./systems/Camera";
import {Complexity} from "./components/Complexity";
import {Platforms} from "./systems/Platforms";
import {Enemies} from "./systems/Enemies";
import {EndGame} from "./systems/EndGame";
import {CollisionUtils} from "./decorators/CollisionUtils";
import {PlatformUtils} from "./decorators/PlatformUtils";
import {CombinationUtils} from "./decorators/CombinationUtils";
import {TweenUtils} from "./decorators/TweenUtils";
import {Shoot} from "./systems/Shoot";
import {Boosters} from "./systems/Boosters";
import {Helpers} from "./systems/Helpers";
import {MathUtils} from "./decorators/MathUtils";
import {Behaviour} from "./systems/Behaviour";
import {GAME_SIZE, GAME} from "./constants/game";
import {statesData} from "./constants/state";
import {factory} from "./config/factory";
import {
  getIsDebug,
  analytics,
  Engine,
  Assets,
  Collector,
  PixiSatDebugSystem,
  Factory,
  SatRenderSystem,
  SatCollisionSystem,
  PixiRenderSystem,
  eventSubscription,
  PIXIController,
  UPDATED,
  RESIZE, UPDATE_DECORATOR_FIELD
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
    this.initProperties();
    this.initECS();
    this.initServiceData();
    this._isInitialized = true;
  }

  playingSelect() {
    this.start();
  }

  initProperties() {
    const {storage, decorators, app, stage, ticker, renderer, canvas, eventBus} = this;
    storage.eventBus = eventBus;
    storage.app = app;
    storage.decorators = decorators;
    storage.stage = stage;
    storage.ticker = ticker;
    storage.renderer = renderer;
    storage.canvas = canvas;
  }

  initECS() {
    this.initEngine();
    this.initSystems();
  }

  initEngine() {
    const {storage, eventBus} = this;
    const decorators = [Utils, CollisionUtils, PlatformUtils, CombinationUtils, TweenUtils, MathUtils];
    this.engine = storage.engine = new Engine({eventBus, storage, decorators});
  }

  initSystems() {
    const {eventBus, engine, storage} = this;

    const fullProps = {eventBus, storage};

    const systemClasses = [
      {System: Level},
      {System: Interactive},
      {System: Movement},
      {System: Shoot},
      {System: Platforms},
      {System: Enemies},
      {System: Spawn},
      {System: Boosters},
      {System: Helpers},
      {System: Camera},
      {System: Behaviour},
      {System: PixiRenderSystem},
      {System: SatRenderSystem},
      {System: SatCollisionSystem},
      getIsDebug() && {System: PixiSatDebugSystem},
      {System: EndGame},
      {System: Game},
      {System: Collector},
      {System: Assets, extraProps: {factory: new Factory({defaultProperties: {eventBus, storage}, config: factory})}}
    ].filter(Boolean);

    systemClasses.forEach(({System, extraProps = {}}) => {
      const props = {...fullProps, ...extraProps};
      const system = new System(props);
      engine.addSystem(system);
    });
  }

  initServiceData() {
    const {storage} = this;
    storage.serviceData = {clearFunctions: []};
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
    gsap.localTimeline.pause(GAME);
  }

  get isAvailableUpdate() {
    const {state} = this;
    return statesData.availableUpdate.includes(state);
  }

  updateEngine() {
    const {engine} = this;
    engine.update(...arguments);
  }

  onUpdated({deltaMS, deltaTime}) {
    if (!this.isAvailableUpdate) return;

    const {
      storage: {
        mainSceneSettings: {timeScale}
      }
    } = this;

    deltaMS *= timeScale;
    deltaTime *= timeScale;

    this.updateEngine({deltaMS, deltaTime, deltaS: deltaTime / 60});

    super.onUpdated(...arguments);
  }

  onResized() {
    const {
      stage,
      $container: {offsetWidth: width, offsetHeight: height}
    } = this;

    const scale = Math.min(width, GAME_SIZE.limitation.width) / GAME_SIZE.width;
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
    const {engine} = this;
    if (!engine) return;

    for (const key in engine.entities) {
      if (key === "game") {
        const eGame = engine.entities[key].list[0];
        const cComplexity = eGame.get(Complexity);
        cComplexity.active = cComplexity.count = 0;
        cComplexity.last = null;
        continue;
      }
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
    super.reset();
  }
}
