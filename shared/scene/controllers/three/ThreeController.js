import BaseController from "../base/BaseController";
import Resize from "../../decorators/resize/Resize";
import State from "../../decorators/state/State";
import Performance from "../../decorators/performance/Performance";
import ThreeUpdate from "../../decorators/three/three-update/ThreeUpdate";
import getIsDebug from "../../../lib/debug/debug";
import {cloneDeep} from "lodash";
import {threeLoader} from "../../loaders/three/ThreeLoader";
import {
  PERFORMANCE_DECORATOR_FIELD,
  RESIZE_DECORATOR_FIELD,
  STATE_DECORATOR_FIELD, UPDATE_DECORATOR_FIELD
} from "../../constants/decorators/names";
import global from "../../../constants/global/global";
import {THREE_WEBGL_RENDERER_CONFIG} from "../../config/three";

export default class ThreeController extends BaseController {
  DECORATORS = [
    {DecoratorClass: ThreeUpdate, decoratorField: UPDATE_DECORATOR_FIELD},
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
    return this._context ??= canvas.getContext("webgl2", {stencil: true});
  }

  get canvas() {
    return ThreeController.canvas;
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
      await threeLoader.init(storage.preload);
      await threeLoader.loadAssets(storage.preload);
    }
  }

  async initScene() {
    this.initSceneInstance();
    this.initCamera();
    this.initRenderer();
  }

  initSceneInstance() {
    const {
      sceneSettings: {
        fog
      } = {}
    } = this;

    return this.scene = new global.THREE.Scene({fog});
  }

  initCamera() {
    const {
      $container: {offsetWidth, offsetHeight},
      cameraSettings: {
        fov = 30,
        aspect = offsetWidth / offsetHeight,
        near = 0.1,
        far = 100
      } = {}
    } = this;

    return this.camera = new global.THREE.PerspectiveCamera(fov, aspect, near, far);
  }

  initRenderer() {
    const {
      $container: {offsetWidth, offsetHeight},
      rendererSettings: {
        shadow,
        background,
        encoding = global.THREE.sRGBEncoding,
        toneMapping = global.THREE.NoToneMapping
      } = {}
    } = this;
    const {canvas, context} = ThreeController;
    const renderer = this.renderer = new global.THREE.WebGLRenderer({...THREE_WEBGL_RENDERER_CONFIG, canvas, context});

    renderer.debug.checkShaderErrors = getIsDebug();

    if (shadow) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = shadow?.type ?? global.THREE.PCFShadowMap;
    }

    if (background?.transparent) {
      const {color, opacity} = background;
      renderer.setClearColor(color, opacity);
    } else renderer.setClearColor(background?.color ?? "#cccccc");

    renderer.setPixelRatio(2);
    renderer.outputEncoding = encoding;
    renderer.toneMapping = toneMapping;

    renderer.setSize(offsetWidth, offsetHeight);

    return renderer;
  }

  initDecorators() {
    const {DECORATORS, scene, camera, decorators, renderer, eventBus, stage, stateMachine, canvas, $container} = this;
    const fullData = {renderer, scene, camera, eventBus, stage, stateMachine, canvas, $container};

    return Promise.all(DECORATORS.map(({DecoratorClass, decoratorField}) => {
      const decorator = decorators[decoratorField] = new DecoratorClass(fullData);
      return decorator.initDecorator();
    }));
  }

  appendContainer($container) {
    const {canvas} = this;
    (this.$container = $container).appendChild(canvas);
  }

  onResized() {
    const {renderer, camera, $container: {offsetWidth, offsetHeight}} = this;

    camera.aspect = offsetWidth / offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(offsetWidth, offsetHeight);
  }

  render() {
    const {scene, camera, renderer} = this;
    renderer.render(scene, camera);
  }

  onUpdated({deltaTime}) {
    const {decorators} = this;

    this.render();

    if (decorators[PERFORMANCE_DECORATOR_FIELD])
      decorators[PERFORMANCE_DECORATOR_FIELD].update();
  }
}