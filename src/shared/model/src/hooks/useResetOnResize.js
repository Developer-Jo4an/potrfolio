import {useEffect} from "react";
import {eventSubscription} from "../../../lib";
import {RESIZE} from "../../../constants";

export function useResetOnResize(ref, resetValue) {
  useEffect(() =>
      eventSubscription({
        callbacksBus: [
          {event: RESIZE, callback: () => ref.current = resetValue}
        ]
      })
    , []);
}