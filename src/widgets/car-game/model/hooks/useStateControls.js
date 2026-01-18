import {useEffect} from "react";
import eventSubscription from "../../../../shared/lib/src/events/eventListener";
import getDefaultState from "../../../../shared/scene/lib/state/getDefaultState";
import useCarStore from "../state-machine/carStore";
import {STATE_CHANGED} from "../../../../shared/scene/constants/events/names";
import {CAR_STATE_MACHINE, IGNORE_NEXT_STATES} from "../../constants/stateMachine";

export default function useStateControls() {
  const {wrapper} = useCarStore();

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus, controller} = wrapper;

    const clear = eventSubscription({
      target: eventBus,
      callbacksBus: [{
        event: STATE_CHANGED,
        async callback({state}) {
          await controller[`${state}Select`]?.();
          if (!IGNORE_NEXT_STATES.includes(state))
            controller.state = CAR_STATE_MACHINE[state].nextState;
        }
      }]
    });

    controller.state = getDefaultState(CAR_STATE_MACHINE);

    return clear;
  }, [wrapper]);
}