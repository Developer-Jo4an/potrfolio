import {AppState as State} from "../../decorators/app-state/AppState";
import {BaseController} from "../base/BaseController";
import {PixiResize} from "../../decorators/pixi/resize/PixiResize";
import {Performance} from "../../decorators/performance/Performance";
import {PIXIUpdate} from "../../decorators/pixi/update/PIXIUpdate";
import {getIsDebug} from "../../../../lib";
import {cloneDeep} from "lodash";
import {initDevtools} from "@pixi/devtools";
import {pixiLoader} from "../../loaders/pixi/PixiLoader";
import {PIXI_APP_CONFIG} from "../../config/pixi";
import {
  PERFORMANCE_DECORATOR_FIELD,
  RESIZE_DECORATOR_FIELD,
  STATE_DECORATOR_FIELD,
  UPDATE_DECORATOR_FIELD
} from "../../constants/decorators/names";

export class PIXIController extends BaseController {
  static get renderer() {
    return this._renderer;
  }

  static set renderer(renderer) {
    this._renderer = renderer;
  }

  static async loadRenderer() {
    if (this._loadRendererPromise) return this._loadRendererPromise;
    const renderer = new PIXI.WebGLRenderer();
    this._loadRendererPromise = await renderer.init(PIXI_APP_CONFIG).then(() => (this.renderer = renderer));
  }

  DECORATORS = [
    {DecoratorClass: PIXIUpdate, decoratorField: UPDATE_DECORATOR_FIELD},
    {DecoratorClass: PixiResize, decoratorField: RESIZE_DECORATOR_FIELD},
    {DecoratorClass: State, decoratorField: STATE_DECORATOR_FIELD},
    getIsDebug() && {DecoratorClass: Performance, decoratorField: PERFORMANCE_DECORATOR_FIELD}
  ].filter(Boolean);

  decorators = {};

  get canvas() {
    return this.renderer.canvas;
  }

  get stage() {
    return this.app.stage;
  }

  get renderer() {
    return PIXIController.renderer;
  }

  get ticker() {
    return this.app.ticker;
  }

  get state() {
    return this.decorators[STATE_DECORATOR_FIELD].state;
  }

  set state(state) {
    this.decorators[STATE_DECORATOR_FIELD].state = state;
  }

  async init() {
    await super.init();
    await this.initDecorators();
  }

  async initScene() {
    await this.initRenderer();
    await this.initApp();
    if (getIsDebug()) await this.initDevTools();
  }

  async initRenderer() {
    await PIXIController.loadRenderer();
  }

  async initApp() {
    const app = (this.app = {});

    app.renderer = this.renderer;

    const stage = (app.stage = new PIXI.Container());
    stage.isStage = true;

    app.ticker = new PIXI.Ticker();
  }

  async initDevTools() {
    const {app: {stage, renderer}} = this;
    await initDevtools({renderer, stage});
    globalThis.__PIXI_STAGE__ = stage;
    globalThis.__PIXI_RENDERER__ = renderer;
  }

  initDecorators() {
    const {DECORATORS, decorators, app, ticker, renderer, eventBus, stage, stateMachine, canvas, $container} = this;
    const fullData = {app, ticker, renderer, eventBus, stage, stateMachine, canvas, $container};

    return Promise.all(
      DECORATORS.map(({DecoratorClass, decoratorField}) => {
        const decorator = (decorators[decoratorField] = new DecoratorClass(fullData));
        return decorator.initDecorator();
      })
    );
  }

  updateDecoratorFields() {
    const {$container, decorators} = this;

    const updatedProps = {$container};

    for (const key in decorators) {
      const decorator = decorators[key];
      decorator.updateProperties(updatedProps);
    }
  }

  prepare() {
    const {$container, decorators, canvas} = this;

    $container.appendChild(canvas);

    this.updateDecoratorFields();

    const resizeDecorator = decorators[RESIZE_DECORATOR_FIELD];
    resizeDecorator.onResized();
  }

  async loadAssets() {
    const {preload, storage} = this;

    if (preload) {
      storage.preload = cloneDeep(preload);
      await pixiLoader.init(storage.preload);
      await pixiLoader.loadAssets(storage.preload);
    }
  }

  onResized() {
  }

  onUpdated() {
    const {decorators, renderer, stage} = this;

    renderer.render(stage);

    if (decorators[PERFORMANCE_DECORATOR_FIELD]) decorators[PERFORMANCE_DECORATOR_FIELD].update();
  }
}
