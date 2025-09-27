import {useEffect} from "react";
import useDunkShotStore from "../state-manager/dunkShotStore";
import eventSubscription from "../../../../shared/lib/events/eventListener";
import {DUNK_SHOT_STATE_MACHINE} from "../../constants/stateMachine";
import {PROGRESS_RESET, THROW_HIT, THROW_PURE} from "../../constants/events";
import {STATE_CHANGED} from "../../../../shared/scene/constants/events/names";
import {ADD, SET, SUBTRACT} from "../../../../shared/constants/actions/names";

export default function useDunkShotStats() {
  const {
    wrapper,
    setDunkShotScore,
    setDunkShotLifes,
    setDunkShotStory,
    setDunkShotProgress,
    setDunkShotPure,
    setDunkShotState
  } = useDunkShotStore();

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: THROW_HIT, callback() {
            setDunkShotScore({action: ADD});
            setDunkShotStory({action: ADD, data: {value: true}});
          }
        },
        {
          event: THROW_PURE, callback() {
            setDunkShotProgress({action: ADD});
            setDunkShotPure({action: ADD});
          }
        },
        {
          event: PROGRESS_RESET, callback() {
            setDunkShotProgress({action: SET, data: {value: 0}});
          }
        },
        {
          event: STATE_CHANGED,
          callback({state}) {
            if (DUNK_SHOT_STATE_MACHINE[state]?.isSubtractLife) {
              setDunkShotLifes({action: SUBTRACT});
              setDunkShotStory({action: ADD, data: {value: false}});
            }

            setDunkShotState(state);
          }
        }
      ]
    });
  }, [wrapper]);
};
