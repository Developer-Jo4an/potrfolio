import System from "../../../../shared/scene/ecs/core/System";
import EventComponent from "../../../../shared/scene/ecs/base/components/EventComponent";
import {CHARACTER} from "../../constants/character";
import {DRAG_END, DRAG_MOVE, DRAG_START} from "../../../../shared/constants/events/eventsNames";
import {CLEAR_HIT, COLLISION_END, COLLISION_START, LOSE, MISS, THROWN, WIN} from "../../constants/events";
import {WIN as WIN_STATUS, LOSE as LOSE_STATUS} from "../../constants/stateMachine";
import {GROUND} from "../../constants/ground";

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

    const cMissEvent = eCharacter.getSome(EventComponent, MISS);
    if (!!cMissEvent?.length) {
      const {eventBus} = this;
      eventBus.dispatchEvent({type: MISS});
      cMissEvent.forEach(cMissEvent => eCharacter.remove(cMissEvent));
    }

    const cThrown = eCharacter.getSome(EventComponent, THROWN);
    if (!!cThrown.length)
      cThrown.forEach(cThrownEvent => eCharacter.remove(cThrownEvent));

    const cWin = eCharacter.getSome(EventComponent, WIN);
    if (!!cWin?.length) {
      const {eventBus} = this;
      eventBus.dispatchEvent({type: WIN, status: WIN_STATUS});
      cWin.forEach(cWinEvent => eCharacter.remove(cWinEvent));
    }

    const cLose = eCharacter.getSome(EventComponent, LOSE);
    if (!!cLose?.length) {
      const {eventBus} = this;
      eventBus.dispatchEvent({type: LOSE, status: LOSE_STATUS});
      cLose.forEach(cLoseEvent => eCharacter.remove(cLoseEvent));
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