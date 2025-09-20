import State from "../../decorators/state/State";
import BaseController from "../base/BaseController";
import Resize from "../../decorators/resize/Resize";
import Performance from "../../decorators/performance/Performance";
import PIXIUpdate from "../../decorators/pixi/pixi-update/PIXIUpdate";
import {getIsDebug} from "../../../lib/debug/debug";
import {applyDecorators} from "../../utils/decorators/applyDecorator";
import {pixiLoader} from "../../loaders/pixi/PixiLoader";
import global from "../../../constants/global/global";
import {PIXI_APP_CONFIG} from "../../config/pixi";
import {
  PERFORMANCE_DECORATOR_FIELD,
  RESIZE_DECORATOR_FIELD,
  STATE_DECORATOR_FIELD,
  UPDATE_DECORATOR_FIELD
} from "../../constants/decorators/names";

export default class PIXIController extends applyDecorators(
  BaseController,
  [
    {DecoratorClass: PIXIUpdate, decoratorField: UPDATE_DECORATOR_FIELD},
    {DecoratorClass: Resize, decoratorField: RESIZE_DECORATOR_FIELD},
    {DecoratorClass: State, decoratorField: STATE_DECORATOR_FIELD},
    getIsDebug() && {DecoratorClass: Performance, decoratorField: PERFORMANCE_DECORATOR_FIELD}
  ].filter(Boolean)
) {

  constructor(data) {
    super(data);
  }

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

  async init() {
    await this.loadAssets();
    await this.initScene();
    await this.initDecorators();
  }

  async loadAssets() {
    const {preload} = this;

    if (preload) {
      await pixiLoader.init();
      await pixiLoader.loadAssets(preload);
    }
  }

  async initScene() {
    const {$container, settings} = this;
    const {canvas, context} = PIXIController;

    const app = this.app = new global.PIXI.Application();
    await app.init({...PIXI_APP_CONFIG, resizeTo: $container, canvas, context, ...settings});
    $container.appendChild(canvas);

    globalThis.__PIXI_APP__ = app;
  }

  initDecorators() {
    const {decorators} = this;

    return Promise.all(Object.values(decorators).map(decorator => decorator.initDecorator()));
  }

  onResized() {
  }

  onUpdated({data: {ms, deltaTime}}) {
    const {decorators} = this;

    if (decorators.performance)
      decorators.performance.update();
  }
}