import {isFunction} from "lodash";

export default function useCallEventFunctions({eventFunctions}) {
  return e => {
    eventFunctions.forEach(eventFunction => {
      if (isFunction(e[eventFunction]))
        e[eventFunction]();
      else
        console.warn(`${eventFunction} is not a function`);
    });
  };
}