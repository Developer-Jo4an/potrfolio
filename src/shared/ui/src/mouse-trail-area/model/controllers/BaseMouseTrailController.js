import {eventSubscription} from "../../../../../lib";
import {MOUSE_ENTER, MOVE, TOUCH_START} from "../../../../../constants";
import {importPixi} from "../../../../../scene";
import {sceneInitConfig} from "../../config/sceneInitConfig";
import {trailTextureSrc} from "../../constants/assets";
import {getEventPosition} from "../../../../../lib";

export class BaseMouseTrailController {

  _isActive = false;

  _isInitialized = false;

  _container = null;

  historyX = [];

  historyY = [];

  historySize = 100;

  ropeSize = 100;

  points = [];

  mousePosition = null;

  constructor() {
    this.onMove = this.onMove.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  get stage() {
    return this.app.stage;
  }

  get canvas() {
    return this.app.canvas;
  }

  get renderer() {
    return this.app.renderer;
  }

  get ticker() {
    return this.app.ticker;
  }

  get isActive() {
    return this._isActive;
  }

  set isActive(isActive) {
    this._isActive = isActive;
    this[isActive ? "activate" : "deactivate"]();
  }

  get isInitialized() {
    return this._isInitialized;
  }

  set isInitialized(isInitialized) {
    this._isInitialized = isInitialized;
  }

  get container() {
    return this._container;
  }

  set container(container) {
    const {canvas} = this;
    this._container = container;
    container.appendChild(canvas);
  }

  async init() {
    if (this.isInitialized) return;

    await importPixi();
    await this.initApplication();
    await this.loadTrailTexture();
    this.initEvents();

    this.isInitialized = true;
  }

  async initApplication() {
    const app = this.app = new PIXI.Application();
    await app.init({...sceneInitConfig, resizeTo: global});
    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;
    app.ticker.add(this.update, this);
  }

  async loadTrailTexture() {
    const trailTexture = this.trailTexture = await PIXI.Assets.load(trailTextureSrc);
  }

  initEvents() {
    eventSubscription({
      callbacksBus: [
        {event: MOVE, callback: this.onMove},
        {event: MOUSE_ENTER, callback: this.onEnter},
        {event: TOUCH_START, callback: this.onEnter}
      ]
    });
  }

  activate() {
    const {app} = this;
    globalThis.__PIXI_APP__ = app;
  }

  deactivate() {
    globalThis.__PIXI_APP__ = null;
  }

  onMove(e) {
    const {x, y} = getEventPosition(e);

    if (!this.mousePosition)
      this.mousePosition = {x, y};

    const {mousePosition} = this;

    mousePosition.x = x;
    mousePosition.y = y;
  }

  onEnter(e) {
    const {points, historyY, historyX} = this;

    const {x, y} = getEventPosition(e);

    if (!this.mousePosition)
      this.mousePosition = {x, y};

    const {mousePosition} = this;

    mousePosition.x = x;
    mousePosition.y = y;

    historyX.fill(x);
    historyY.fill(y);

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      point.x = x;
      point.y = y;
    }
  }

  startUpdate() {
    const {ticker} = this;
    ticker.start();
  }

  stopUpdate() {
    const {ticker} = this;
    ticker.stop();
  }

  update() {

  }
}