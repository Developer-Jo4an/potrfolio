import System from "../../../../shared/scene/ecs/core/System";
import EventComponent from "../../../../shared/scene/ecs/base/components/EventComponent";
import {CHARACTER} from "../../entities/character";
import {DRAG_END, DRAG_MOVE, DRAG_START} from "../../../../shared/constants/events/eventsNames";
import {CLEAR_HIT, COLLISION_END, COLLISION_START} from "../../constants/events";
import {GROUND} from "../../entities/ground";

export default class Event extends System {
  updateCharacterEvents({eCharacter}) {
    const csDragEvent = eCharacter.getSome(EventComponent, DRAG_START, DRAG_MOVE, DRAG_END);

    if (!!csDragEvent?.length) {
      if (csDragEvent[csDragEvent.length - 1].type === DRAG_END) {
        eCharacter.removeSome(EventComponent);
        return;
      }

      const csDragMove = csDragEvent.filter(({type}) => type === DRAG_MOVE);

      if (csDragMove?.length > 1) {
        const unnecessaryEvent = csDragEvent[1];
        eCharacter.remove(unnecessaryEvent);
      }
    }

    const csCollisionEvent = eCharacter.getSome(EventComponent, COLLISION_START, COLLISION_END);
    if (!!csCollisionEvent?.length)
      csCollisionEvent.forEach(cEvent => eCharacter.remove(cEvent));

    const cClearHitEvent = eCharacter.getSome(EventComponent, CLEAR_HIT);
    if (!!cClearHitEvent?.length) {
      const {eventBus} = this;
      eventBus.dispatchEvent({type: CLEAR_HIT});
      cClearHitEvent.forEach(cClearHitEvent => eCharacter.remove(cClearHitEvent));
    }
  }

  updateGroundEvents({eGround}) {
    const csCollisionEvent = eGround.getSome(EventComponent, COLLISION_START, COLLISION_END);
    csCollisionEvent.forEach(cEvent => eGround.remove(cEvent));
  }

  update() {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const eGround = this.getFirstEntityByType(GROUND);
    const fullProps = {eCharacter, eGround};
    this.updateCharacterEvents(fullProps);
    this.updateGroundEvents(fullProps);
  }
}