import {useEffect} from "react";
import {eventSubscription} from "@shared";

export function useEndGame({wrapper, onEnd}) {
  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [{event: ["win", "lose"], callback: onEnd}]
    });
  }, [wrapper]);
}
