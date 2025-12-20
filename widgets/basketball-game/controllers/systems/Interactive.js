import System from "../../../../shared/scene/ecs/core/System";
import ThreeComponent from "../../../../shared/scene/ecs/three/components/ThreeComponent";
import EventComponent from "../../../../shared/scene/ecs/base/components/EventComponent";
import eventSubscription from "../../../../shared/lib/events/eventListener";
import getEventPosition from "../../../../shared/lib/events/eventPosition";
import {CHARACTER} from "../../entities/character";
import {DRAG_END, DRAG_MOVE, DRAG_START, END, MOVE, START} from "../../../../shared/constants/events/eventsNames";

export default class Interactive extends System {

  clearData = {
    functions: []
  };

  constructor() {
    super(...arguments);

    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    const {storage: {renderer, camera, canvas}} = this;

    this.interactionManager = new THREE.Interactive.InteractionManager(renderer, camera, canvas);
  }

  initializationLevelSelect() {
    const {interactionManager, clearData} = this;

    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const cThreeComponent = eCharacter.get(ThreeComponent);

    const clearEvents = eventSubscription({
      callbacksBus: [
        {event: START, callback: this.onStart, target: cThreeComponent.threeObject},
        {event: MOVE, callback: this.onMove, target: global},
        {event: END, callback: this.onEnd, target: global}
      ]
    });

    interactionManager.add(cThreeComponent.threeObject);

    clearData.functions.push(() => {
      interactionManager.remove(cThreeComponent.threeObject);
      clearEvents();
    });
  }

  onStart({originalEvent}) {
    const {storage: {gameSpace}} = this;
    if (gameSpace.returnsBack) return;
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const cEvent = this.createInteractiveEvent(DRAG_START, originalEvent);
    eCharacter.add(cEvent);
  }

  onMove(e) {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const csEvent = eCharacter.getList(EventComponent);
    const isHasDragStart = csEvent[0]?.type === DRAG_START;
    if (isHasDragStart) {
      const cEvent = this.createInteractiveEvent(DRAG_MOVE, e);
      eCharacter.add(cEvent);
    }
  }

  onEnd(e) {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const csEvent = eCharacter.getList(EventComponent);
    const isHasDragStart = csEvent[0]?.type === DRAG_START;
    if (isHasDragStart) {
      const cEvent = this.createInteractiveEvent(DRAG_END, e);
      eCharacter.add(cEvent);
    }
  }

  createInteractiveEvent(type, event) {
    const {eventBus} = this;
    const cursor = getEventPosition(event);
    return new EventComponent({eventBus, type, data: {cursor}});
  }

  update() {
    const {interactionManager} = this;
    interactionManager.update();
  }

  reset() {
    const {clearData} = this;

    clearData.functions.forEach(func => func());
    clearData.functions.length = 0;
  }
}