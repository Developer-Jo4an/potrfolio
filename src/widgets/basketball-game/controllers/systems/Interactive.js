import {
  getEventPosition,
  createAnimationFrame,
  eventSubscription,
  System,
  ThreeComponent,
  EventComponent,
  DRAG_END,
  DRAG_MOVE,
  DRAG_START,
  END,
  MOVE,
  START
} from "@shared";
import {CHARACTER} from "../../constants/character";
import {GAME} from "../../constants/game";
import {State} from "@/shared/scene/src/ecs/base/components/state/State"; //TODO: поправить импорт

export class Interactive extends System {
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

  get isDrag() {
    const {storage: {gameSpace: {get}}} = this;
    const {characterMovement: {isDrag}} = get();
    return isDrag;
  }

  onStart({originalEvent}) {
    if (this.isDrag || !this.isAvailableInteractive) return;

    const {storage: {gameSpace: {set}}} = this;
    set(({characterMovement}) => characterMovement.isDrag = true);

    this.addInteractiveEvent(DRAG_START, originalEvent);
  }

  onMove(e) {
    if (this.isDrag && this.isAvailableInteractive)
      this.addInteractiveEvent(DRAG_MOVE, e);
  }

  onEnd(e) {
    if (this.isDrag && this.isAvailableInteractive) {
      const {storage: {gameSpace: {set}}} = this;
      set(({characterMovement}) => characterMovement.isDrag = false);
      this.addInteractiveEvent(DRAG_END, e);
    }
  }

  addInteractiveEvent(type, event) {
    const {eventBus} = this;

    const eCharacter = this.getFirstEntityByType(CHARACTER);

    const cursor = getEventPosition(event);
    cursor.timestamp = performance.now();

    const newEvent = new EventComponent({eventBus, type, data: {cursor}});
    eCharacter.add(newEvent);

    this.clearExtraEvents(type);
  }

  clearExtraEvents(type) {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    if (type === DRAG_MOVE) {
      const {storage: {mainSceneSettings: {character: {throw: {dragEventCountForThrow}}}}} = this;
      const csDragEvents = eCharacter.getSome(EventComponent, DRAG_MOVE);
      if (csDragEvents?.length > dragEventCountForThrow) {
        const firstEvent = csDragEvents[0];
        eCharacter.remove(firstEvent);
      }
    } else if (type === DRAG_END) {
      const {storage: {gameSpace: {set}}} = this;
      const csDragEvents = eCharacter.getSome(EventComponent, DRAG_START, DRAG_MOVE, DRAG_END);
      set(({serviceData: {clearFunctions}}) => {
        clearFunctions.push(
          createAnimationFrame(() => {
            csDragEvents.forEach(event => eCharacter.remove(event));
          })
        );
      });
    }
  }

  update() {
    const {interactionManager} = this;
    interactionManager.update();
  }
}