import BaseDecorator from "../base/BaseDecorator";
import {getIsDebug} from "../../../lib/debug/debug";
import {STATE_CHANGED} from "../../constants/events/names";

export default class State extends BaseDecorator {

  _state;

  get state() {
    return this._state;
  }

  set state(state) {
    const {stateMachine, controller: {eventDispatcher}} = this;

    const {availableStates} = stateMachine;

    if (availableStates.includes(state)) {
      this._state = state;
      eventDispatcher.dispatchEvent({type: STATE_CHANGED, state});
      console.log(`%cSTATE>>%c ${state}`, "color: green");
    } else if (getIsDebug())
      throw new Error(`availableStates: ${availableStates} not includes new state: ${state}`);
  }
}