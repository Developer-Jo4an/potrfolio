import {isFunction} from "lodash";

export default function useCallEventFunctions({eventFunctions}) {
  return e => {
    eventFunctions.forEach(eventFunction => {
      const necessaryFunction = e[eventFunction];
      if (isFunction(necessaryFunction))
        necessaryFunction();
      else
        console.warn(`${eventFunction} is not a function`);
    });
  };
}