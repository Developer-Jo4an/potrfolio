import {useEffect} from "react";
import {eventSubscription} from "../../../../lib";
import {getDefaultState} from "../../lib/state/getDefaultState";
import {STATE_CHANGED} from "../../constants/events/names";

export function useStateControls(wrapper, stateMachine, ignoreNextStates, reducers = {}, onChangedAnyState) {
  useEffect(() => {
    if (!wrapper) return;

    const {eventBus, controller} = wrapper;

    const clear = eventSubscription({
      target: eventBus,
      callbacksBus: [{
        event: STATE_CHANGED,
        async callback({state}) {
          const changeStatePromise = controller[`${state}Select`]?.();

          onChangedAnyState?.(state);

          const nextState = stateMachine[state].nextState;

          const onStateChange = reducers[state];
          await onStateChange?.(
            changeStatePromise,
            (newState = nextState) => controller.state = newState
          );

          await changeStatePromise;

          if (!ignoreNextStates.includes(state))
            controller.state = nextState;
        }
      }]
    });

    controller.state = getDefaultState(stateMachine);

    return clear;
  }, [wrapper, reducers]);
}