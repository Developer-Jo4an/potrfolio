import {useLayoutEffect} from "react";
import {eventSubscription} from "../../../lib";
import {RESIZE} from "../../../constants";

export function useOnResize(callback) {
  useLayoutEffect(() => {
    callback?.();
    return eventSubscription({callbacksBus: [{event: RESIZE, callback}]});
  }, [callback]);
}
