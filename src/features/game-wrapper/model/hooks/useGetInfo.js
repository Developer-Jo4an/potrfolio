import {useEffect} from "react";
import {eventSubscription} from "@shared";

export const Events = {
  GET_INFO: "info:get"
};

export function useGetInfo(fullProps) {
  useEffect(() => {
    const {wrapper} = fullProps;
    if (!wrapper) return;

    return eventSubscription({
      target: wrapper.eventBus,
      callbacksBus: [
        {
          event: Events.GET_INFO,
          callback({result}) {
            for (const key in fullProps) result[key] = fullProps[key];
          }
        }
      ]
    });
  }, [fullProps]);
}