import {System, EventComponent} from "shared";
import {CHARACTER} from "../constants/character";
import {CLEAR_HIT, COLLISION_END, COLLISION_START, MISS, THROWN} from "../constants/events";
import {WIN as WIN_STATUS, LOSE as LOSE_STATUS} from "../constants/stateMachine";
import {GROUND} from "../constants/ground";
import {Events} from "@features/game-wrapper";

export class Event extends System {
  updateCharacterEvents({eCharacter}) {
    const csCollisionEvent = eCharacter.getSome(EventComponent, COLLISION_START, COLLISION_END);
    if (!!csCollisionEvent?.length) csCollisionEvent.forEach((cEvent) => eCharacter.remove(cEvent));

    const csClearHitEvent = eCharacter.getSome(EventComponent, CLEAR_HIT);
    if (!!csClearHitEvent?.length) {
      const {eventBus} = this;
      eventBus.dispatchEvent({type: CLEAR_HIT});
      csClearHitEvent.forEach((cClearHitEvent) => eCharacter.remove(cClearHitEvent));
    }

    const csMissEvent = eCharacter.getSome(EventComponent, MISS);
    if (!!csMissEvent?.length) {
      const {eventBus} = this;
      eventBus.dispatchEvent({type: MISS});
      csMissEvent.forEach((cMissEvent) => eCharacter.remove(cMissEvent));
    }

    const csThrownEvent = eCharacter.getSome(EventComponent, THROWN);
    if (!!csThrownEvent.length) csThrownEvent.forEach((cThrownEvent) => eCharacter.remove(cThrownEvent));

    const csWin = eCharacter.getSome(EventComponent, Events.WIN);
    if (!!csWin?.length) {
      const {eventBus} = this;
      eventBus.dispatchEvent({type: Events.WIN, status: WIN_STATUS});
      csWin.forEach((cWinEvent) => eCharacter.remove(cWinEvent));
    }

    const csLose = eCharacter.getSome(EventComponent, Events.LOSE);
    if (!!csLose?.length) {
      const {eventBus} = this;
      eventBus.dispatchEvent({type: Events.LOSE, status: LOSE_STATUS});
      csLose.forEach((cLoseEvent) => eCharacter.remove(cLoseEvent));
    }
  }

  updateGroundEvents({eGround}) {
    const csCollisionEvent = eGround.getSome(EventComponent, COLLISION_START, COLLISION_END);
    csCollisionEvent.forEach((cEvent) => eGround.remove(cEvent));
  }

  update() {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const eGround = this.getFirstEntityByType(GROUND);
    const fullProps = {eCharacter, eGround};
    this.updateCharacterEvents(fullProps);
    this.updateGroundEvents(fullProps);
  }
}
