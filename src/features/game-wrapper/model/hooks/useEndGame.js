import {useEffect} from "react";
import {eventSubscription} from "@shared";
import {Events} from "../../constants/events";

export function useEndGame({wrapper, onEnd}) {
  useEffect(() => {
    if (!wrapper || !onEnd) return;
    const {eventBus} = wrapper;
    return eventSubscription({
      target: eventBus,
      callbacksBus: [{event: [Events.WIN, Events.LOSE], callback: onEnd}],
    });
  }, [wrapper, onEnd]);
}
