import {useEffect} from "react";
import eventSubscription from "../../../lib/src/events/eventListener";
import {RESIZE} from "../../../constants/src/events/eventsNames";

export const useResetOnResize = (ref, resetValue) => {
  useEffect(() =>
      eventSubscription({
        callbacksBus: [
          {event: RESIZE, callback: () => ref.current = resetValue}
        ]
      })
    , []);
};