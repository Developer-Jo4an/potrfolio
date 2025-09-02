import {isFunction} from "lodash";

export default function useCallCallbacks(
  {
    callbacksData: {
      callbacks,
      calledFunctions = [],
      calledFunctionsProps = {}
    }
  }) {
  return () => {
    calledFunctions.forEach(calledFunction => {
      const necessaryCallbacks = callbacks[calledFunction];

      if (isFunction(necessaryCallbacks))
        necessaryCallbacks(calledFunctionsProps[calledFunction]);
      else
        console.warn(`${calledFunction} is not a function`);
    });
  };
}