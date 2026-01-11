import {useEffect} from "react";
import {isFunction} from "lodash";

export default function useResetScene({wrapper}) {
  useEffect(() => () => {
    if (isFunction(wrapper?.reset))
      wrapper.reset();
  }, [wrapper]);
}