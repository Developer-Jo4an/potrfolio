import {useEffect} from "react";
import {eventSubscription, STATE_CHANGED, ADD, SET, SUBTRACT} from "@shared";
import {useDunkShotStore} from "../state-manager/dunkShotStore";
import {STATE_MACHINE} from "../../controllers/constants/stateMachine";
import {PROGRESS_RESET, THROW_HIT, THROW_PURE} from "../../controllers/constants/events";

export function useStats() {
  const {
    wrapper,
    setScore,
    setLifes,
    setStory,
    setProgress,
    setPure, //TODO: убрать DUnkShot prefix
  } = useDunkShotStore();

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: THROW_HIT,
          callback() {
            setScore({action: ADD});
            setStory({action: ADD, data: {value: true}});
          },
        },
        {
          event: THROW_PURE,
          callback() {
            setProgress({action: ADD});
            setPure({action: ADD});
          },
        },
        {
          event: PROGRESS_RESET,
          callback() {
            setProgress({action: SET, data: {value: 0}});
          },
        },
        {
          event: STATE_CHANGED,
          callback({state}) {
            if (STATE_MACHINE[state]?.isSubtractLife) {
              setLifes({action: SUBTRACT});
              setStory({action: ADD, data: {value: false}});
            }
          },
        },
      ],
    });
  }, [wrapper]);
}
