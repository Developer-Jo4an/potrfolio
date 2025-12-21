import System from "../../../../shared/scene/ecs/core/System";
import EventComponent from "../../../../shared/scene/ecs/base/components/EventComponent";
import {CHARACTER} from "../../entities/character";
import {DRAG_END, DRAG_MOVE, DRAG_START} from "../../../../shared/constants/events/eventsNames";
import {COLLISION_END, COLLISION_START} from "../../constants/events";

export default class Event extends System {
  updateCharacterEvents({eCharacter}) {
    const {storage: {mainSceneSettings: {events: {maxDragMoveCount}}}} = this;

    const csEvent = eCharacter.getSome(EventComponent, DRAG_START, DRAG_MOVE, DRAG_END);

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

  clearCollisionEvents({eCharacter}) {
    // TODO: для всех сущностей
    const csEvent = eCharacter.getSome(EventComponent, COLLISION_START, COLLISION_END);
    csEvent.forEach(cEvent => eCharacter.remove(cEvent));
  }

  update() {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const fullProps = {eCharacter};
    this.updateCharacterEvents(fullProps);
    this.clearCollisionEvents(fullProps);
  }
}