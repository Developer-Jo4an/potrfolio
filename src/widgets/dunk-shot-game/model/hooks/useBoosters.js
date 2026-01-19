import {useEffect} from "react";
import {eventSubscription, APPLY, DISABLED} from "@shared";
import {useDunkShotStore} from "../state-manager/dunkShotStore";
import {WINGS, EXTRA_LIFE, X2} from "../../constants/boosters";
import {BOOSTERS_SET_DISABLED} from "../../constants/events";
import {WINGS as WINGS_STATE} from "../../constants/stateMachine";
import content from "../../constants/content";

export function useBoosters() {
  const {wrapper, setDunkShotBoosters, gameData: {boosters}} = useDunkShotStore();

  const boosterCallbacks = {
    [EXTRA_LIFE]() {
      setDunkShotBoosters({action: APPLY, data: EXTRA_LIFE});
    },
    [X2]() {
      setDunkShotBoosters({action: APPLY, data: X2});
    },
    [WINGS]() {
      setDunkShotBoosters({action: APPLY, data: WINGS});
      wrapper.state = WINGS_STATE;
    }
  };

  const onClick = ({value, name, isDisabled}) => {
    if (value && !isDisabled)
      boosterCallbacks[name]();
  };

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: BOOSTERS_SET_DISABLED,
          callback({isDisabled}) {
            setDunkShotBoosters({action: DISABLED, data: isDisabled});
          }
        }
      ]
    });
  }, [wrapper]);

  return {
    boosters: boosters?.map(boosterData => {
      const extraData = content.boosters.find(({booster}) => booster === boosterData.name);
      return {...boosterData, ...extraData};
    }),
    onClick
  };
};