import {useEffect} from "react";
import {isFunction} from "lodash";

export function useResetScene({wrapper}) {
  useEffect(
    () => () => {
      if (isFunction(wrapper?.reset)) wrapper.reset();
    },
    [wrapper],
  );
}
