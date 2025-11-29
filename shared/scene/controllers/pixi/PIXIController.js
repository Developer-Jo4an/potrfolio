import State from "../../decorators/state/State";
import BaseController from "../base/BaseController";
import Resize from "../../decorators/resize/Resize";
import Performance from "../../decorators/performance/Performance";
import PIXIUpdate from "../../decorators/pixi/pixi-update/PIXIUpdate";
import {getIsDebug} from "../../../lib/debug/debug";
import {cloneDeep} from "lodash";
import {pixiLoader} from "../../loaders/pixi/PixiLoader";
import global from "../../../constants/global/global";
import {PIXI_APP_CONFIG} from "../../config/pixi";
import {
  PERFORMANCE_DECORATOR_FIELD,
  RESIZE_DECORATOR_FIELD,
  STATE_DECORATOR_FIELD,
  UPDATE_DECORATOR_FIELD
} from "../../constants/decorators/names";

export default class PIXIController extends BaseController {

  DECORATORS = [
    {DecoratorClass: PIXIUpdate, decoratorField: UPDATE_DECORATOR_FIELD},
    {DecoratorClass: Resize, decoratorField: RESIZE_DECORATOR_FIELD},
    {DecoratorClass: State, decoratorField: STATE_DECORATOR_FIELD},
    getIsDebug() && {DecoratorClass: Performance, decoratorField: PERFORMANCE_DECORATOR_FIELD}
  ].filter(Boolean);

  decorators = {};

  static get canvas() {
    return this._canvas ??= document.createElement("canvas");
  }

  static get context() {
    const {canvas} = this;
    return this._context ??= canvas.getContext("webgl2");
  }

  get canvas() {
    return PIXIController.canvas;
  }

  get stage() {
    return this.app.stage;
  }

  get renderer() {
    return this.app.renderer;
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

  async loadAssets() {
    const {preload, storage} = this;

    if (preload) {
      storage.preload = cloneDeep(preload);
      await pixiLoader.init();
      await pixiLoader.loadAssets(storage.preload);
    }
  }

  async initScene() {
    const {$container, settings} = this;
    const {canvas, context} = PIXIController;

    const app = this.app = new global.PIXI.Application();
    await app.init({...PIXI_APP_CONFIG, resizeTo: $container, canvas, context, ...settings});
    globalThis.__PIXI_APP__ = app;
  }

  initDecorators() {
    const {DECORATORS, decorators} = this;

    return Promise.all(DECORATORS.map(({DecoratorClass, decoratorField}) => {
      const decorator = decorators[decoratorField] = new DecoratorClass(this.getDecoratorData());
      return decorator.initDecorator();
    }));
  }

  appendContainer($container) {
    const {canvas} = PIXIController;

    (this.$container = $container).appendChild(canvas);
  }

  getDecoratorData() {
    const {app, ticker, renderer, eventBus, stage, stateMachine, canvas, $container} = this;
    return {app, ticker, renderer, eventBus, stage, stateMachine, canvas, $container};
  }

  onResized() {
  }

  onUpdated() {
    const {decorators} = this;

    if (decorators[PERFORMANCE_DECORATOR_FIELD])
      decorators[PERFORMANCE_DECORATOR_FIELD].update();
  }
}