import BaseController from "../base/BaseController";
import Resize from "../../decorators/resize/Resize";
import State from "../../decorators/state/State";
import Performance from "../../decorators/performance/Performance";
import {getIsDebug} from "../../../lib/debug/debug";
import {
  PERFORMANCE_DECORATOR_FIELD,
  RESIZE_DECORATOR_FIELD,
  STATE_DECORATOR_FIELD
} from "../../constants/decorators/names";

export default class ThreeController extends BaseController {
  DECORATORS = [
    {DecoratorClass: Resize, decoratorField: RESIZE_DECORATOR_FIELD},
    {DecoratorClass: State, decoratorField: STATE_DECORATOR_FIELD},
    getIsDebug() && {DecoratorClass: Performance, decoratorField: PERFORMANCE_DECORATOR_FIELD}
  ].filter(Boolean);

  decorators = {};

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

  }

  async initScene() {

  }

  initDecorators() {
    const {DECORATORS, decorators, renderer, eventBus, stage, stateMachine, canvas, $container} = this;
    const fullData = {renderer, eventBus, stage, stateMachine, canvas, $container};

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
  }

  onUpdated() {
    const {decorators} = this;
    if (decorators[PERFORMANCE_DECORATOR_FIELD])
      decorators[PERFORMANCE_DECORATOR_FIELD].update();
  }
}