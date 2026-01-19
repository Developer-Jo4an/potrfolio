import {isFunction} from "lodash";

export function useCallEventFunctions({eventFunctions}) {
  return e => {
    eventFunctions.forEach(eventFunction => {
      if (isFunction(e[eventFunction]))
        e[eventFunction]();
      else
        console.warn(`${eventFunction} is not a function`);
    });
  };
}