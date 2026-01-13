import System from "../../../../shared/scene/ecs/core/System";
import ThreeComponent from "../../../../shared/scene/ecs/three/components/ThreeComponent";
import EventComponent from "../../../../shared/scene/ecs/base/components/EventComponent";
import State from "../../../../shared/scene/ecs/base/components/state/State";
import eventSubscription from "../../../../shared/lib/events/eventListener";
import getEventPosition from "../../../../shared/lib/events/eventPosition";
import {CHARACTER} from "../../constants/character";
import {DRAG_END, DRAG_MOVE, DRAG_START, END, MOVE, START} from "../../../../shared/constants/events/eventsNames";
import {GAME} from "../../constants/game";

export default class Interactive extends System {
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
    const {interactionManager, storage: {gameSpace: {set}}} = this;

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

    set(
      ({serviceData: {clearFunctions}}) => {
        clearFunctions.push(() => {
          interactionManager.remove(cThreeComponent.threeObject);
          clearEvents();
        });
      }
    );
  }

  get isAvailableInteractive() {
    const {storage: {states, gameSpace: {get}}} = this;
    const {characterMovement: {returnsBack, thrown}, activeBooster} = get();
    const eGame = this.getFirstEntityByType(GAME);
    const cState = eGame.get(State);
    return !returnsBack && !thrown && !activeBooster && !!states[cState.state]?.isAvailableInteractive;
  }

  onStart({originalEvent}) {
    const {isAvailableInteractive} = this;
    if (!isAvailableInteractive) return;

    const {storage: {gameSpace: {set}}} = this;
    set(({characterMovement}) => characterMovement.isDrag = true);

    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const cEvent = this.createInteractiveEvent(DRAG_START, originalEvent);
    eCharacter.add(cEvent);
  }

  onMove(e) {
    const {isAvailableInteractive} = this;
    if (!isAvailableInteractive) return;

    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const csEvent = eCharacter.getSome(EventComponent, DRAG_START, DRAG_MOVE, DRAG_END);
    const isHasDragStart = csEvent[0]?.type === DRAG_START;

    if (isHasDragStart) {
      const cEvent = this.createInteractiveEvent(DRAG_MOVE, e);
      eCharacter.add(cEvent);
    }
  }

  onEnd(e) {
    const {isAvailableInteractive} = this;
    if (!isAvailableInteractive) return;

    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const csEvent = eCharacter.getSome(EventComponent, DRAG_START, DRAG_MOVE, DRAG_END);
    const isHasDragStart = csEvent[0]?.type === DRAG_START;

    if (isHasDragStart) {
      const {storage: {gameSpace: {set}}} = this;
      set(({characterMovement}) => characterMovement.isDrag = false);

      const cEvent = this.createInteractiveEvent(DRAG_END, e);
      eCharacter.add(cEvent);
    }
  }

  createInteractiveEvent(type, event) {
    const {eventBus} = this;
    const cursor = getEventPosition(event);
    cursor.timestamp = Math.round(performance.now());
    return new EventComponent({eventBus, type, data: {cursor}});
  }

  update() {
    const {interactionManager} = this;
    interactionManager.update();
  }
}