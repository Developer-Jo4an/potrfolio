import {useEffect} from "react";
import eventSubscription from "../../../lib/events/eventListener";
import {RESIZE} from "../../../constants/events/eventsNames";

export const useResetOnResize = (ref, resetValue) => {
  useEffect(() =>
      eventSubscription({
        callbacksBus: [
          {event: RESIZE, callback: () => ref.current = resetValue}
        ]
      })
    , []);
};