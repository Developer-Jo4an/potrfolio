import {useEffect} from "react";
import eventSubscription from "../../../../shared/lib/events/eventListener";
import useDunkShotStore from "../state-manager/dunkShotStore";
import {CLOVER, EXTRA_LIFE, X2} from "../../constants/boosters";
import {BOOSTERS_SET_DISABLED} from "../../constants/events";
import {APPLY, DISABLED} from "../../../../shared/constants/actions/names";
import {CLOVER as CLOVER_STATE} from "../../constants/stateMachine";
import content from "../../constants/content";

export default function useBoosters() {
  const {wrapper, setDunkShotBoosters, gameData: {boosters}} = useDunkShotStore();

  const boosterCallbacks = {
    [EXTRA_LIFE]() {
      setDunkShotBoosters({action: APPLY, data: EXTRA_LIFE});
    },
    [X2]() {
      setDunkShotBoosters({action: APPLY, data: X2});
    },
    [CLOVER]() {
      setDunkShotBoosters({action: APPLY, data: CLOVER});
      wrapper.state = CLOVER_STATE;
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