import {useEffect} from "react";
import useBasketballStore from "../state-manager/basketballStore";
import eventSubscription from "../../../../shared/lib/src/events/eventListener";
import {GET_INFO} from "../../constants/events";

export default function useGetInfo(fullProps) {
  const {wrapper} = useBasketballStore();

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: GET_INFO, callback({result}) {
            for (const key in fullProps)
              result[key] = fullProps[key];
          }
        }
      ]
    });
  }, [wrapper, fullProps]);
}