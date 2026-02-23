import {BaseDecorator} from "../base/BaseDecorator";
import {getIsDebug} from "../../../../lib";
import {STATE_CHANGED} from "../../constants/events/names";
import {IDLE} from "../../constants/decorators/state/state";

export class AppState extends BaseDecorator {
  _state = IDLE;

  get state() {
    return this._state;
  }

  set state(state) {
    const {state: currentState, eventBus, stateMachine} = this;
    const {availableStates} = stateMachine[currentState] ?? {};

    if (currentState === state) {
      if (getIsDebug()) throw new Error(`currentState === state: ${state}`);
      return;
    }

    if (currentState || availableStates.includes(state)) {
      this._state = state;
      eventBus.dispatchEvent({type: STATE_CHANGED, state});
      console.log(`%cSTATE>> ${state}`, "color: green");
    } else if (getIsDebug()) throw new Error(`availableStates: ${availableStates} not includes new state: ${state}`);
  }
}


