import BaseController from "../BaseController/BaseController";
import {copy} from "../../../../../shared/lib/copy/copy";
import eventSubscription from "../../../../../shared/lib/events/eventListener";
import {angle, distance} from "../../../../../shared/lib/matrix/matrix";
import {
  DRAG_END,
  DRAG_MOVE,
  DRAG_START,
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
  POINTER_UP_OUTSIDE
} from "../../../../../shared/constants/events/eventsNames";
import {DUNK_SHOT_STATE_MACHINE} from "../../../constants/stateMachine";
import global from "../../../../../shared/constants/global/global";

export default class InteractionController extends BaseController {

  dragData = {
    isDragging: false,
    start: null,
    current: null,
    angle: null,
    stretch: null,
    path: []
  };

  constructor(data) {
    super(data);

    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  initEvents() {
    const {stage} = this;

    eventSubscription({
      target: stage,
      callbacksBus: [
        {event: POINTER_DOWN, callback: this.onStart},
        {event: POINTER_MOVE, callback: this.onMove},
        {event: [POINTER_UP, POINTER_UP_OUTSIDE], callback: this.onEnd}
      ], postfix: "", actionAdd: "on", actionRemove: "off"
    });
  }

  init() {
    const {stage, app} = this;

    const interactiveLayer = new global.PIXI.Container();
    interactiveLayer.name = "interactiveArea";
    interactiveLayer.hitArea = new global.PIXI.Rectangle(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);

    stage.addChild(interactiveLayer);
  }

  onStart({data: {global}}) {
    const {dragData, eventBus} = this;

    if (dragData.isDragging) return;

    dragData.isDragging = true;
    dragData.start = {x: global.x, y: global.y};
    dragData.current = {x: global.x, y: global.y};
    dragData.path.push({x: global.x, y: global.y});

    eventBus.dispatchEvent({type: DRAG_START, dragData: copy(dragData)});
  }

  onMove({data: {global}}) {
    const {dragData, eventBus} = this;

    if (!dragData.isDragging) return;

    dragData.current = {x: global.x, y: global.y};
    dragData.angle = angle([dragData.start.x, dragData.start.y], [global.x, global.y]);
    dragData.stretch = distance([dragData.start.x, dragData.start.y], [dragData.current.x, dragData.current.y]);
    dragData.path.push({x: global.x, y: global.y});

    eventBus.dispatchEvent({type: DRAG_MOVE, dragData: copy(dragData)});
  }

  onEnd() {
    const {dragData, eventBus} = this;

    if (!dragData.isDragging) return;

    dragData.isDragging = false;
    dragData.start = null;
    dragData.current = null;
    dragData.angle = null;
    dragData.path.length = 0;

    eventBus.dispatchEvent({type: DRAG_END, dragData: copy(dragData)});
  }

  onStateChanged(state) {
    const {stage} = this;

    stage.interactive = !!DUNK_SHOT_STATE_MACHINE[state].isAvailableInteraction;
  }
}
