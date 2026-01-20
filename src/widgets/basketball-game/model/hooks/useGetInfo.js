import {useEffect} from "react";
import {eventSubscription} from "@shared";
import {useBasketballStore} from "../state-manager/basketballStore";
import {GET_INFO} from "../../constants/events";

export function useGetInfo(fullProps) {
  const {wrapper} = useBasketballStore();

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: GET_INFO,
          callback({result}) {
            for (const key in fullProps) result[key] = fullProps[key];
          },
        },
      ],
    });
  }, [wrapper, fullProps]);
}
