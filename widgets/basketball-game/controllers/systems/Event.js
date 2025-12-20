import System from "../../../../shared/scene/ecs/core/System";
import EventComponent from "../../../../shared/scene/ecs/base/components/EventComponent";
import {CHARACTER} from "../../entities/character";
import {DRAG_END, DRAG_MOVE} from "../../../../shared/constants/events/eventsNames";

export default class Event extends System {
  updateCharacterEvents() {
    const {storage: {mainSceneSettings: {events: {maxDragMoveCount}}}} = this;

    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const csEvent = eCharacter.getList(EventComponent);

    if (!csEvent?.length) return;

    if (csEvent[csEvent.length - 1].type === DRAG_END) {
      eCharacter.removeSome(EventComponent);
      return;
    }

    const csDragMove = csEvent.filter(({type}) => type === DRAG_MOVE);

    if (csDragMove?.length > maxDragMoveCount) {
      const unnecessaryEvent = csEvent[1];
      eCharacter.remove(unnecessaryEvent);
    }
  }

  update() {
    this.updateCharacterEvents();
  }
}