import {useEffect} from "react";
import eventSubscription from "../../../lib/events/eventListener";
import {getDefaultState} from "../../lib/state/getDefaultState";
import {STATE_CHANGED} from "../../constants/events/names";

export default function useStateController(wrapper, ignoreNextStates, stateMachine) {
  useEffect(() => {
    if (!wrapper) return;

    const {eventBus, controller} = wrapper;

    const clear = eventSubscription({
      target: eventBus,
      callbacksBus: [{
        event: STATE_CHANGED, async callback({state}) {
          await controller[`${state}Select`]?.();
          if (!ignoreNextStates.includes(state))
            controller.state = stateMachine[state].nextState;
        }
      }]
    });

    controller.state = getDefaultState(stateMachine);

    return clear;
  }, [wrapper]);
}