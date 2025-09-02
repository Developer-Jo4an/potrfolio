import {useEffect, useRef} from "react";
import {isNumber} from "lodash";

export default function useCheckTimeout({timeout}) {
  const timeoutRef = useRef();

  useEffect(() => () => isNumber(timeoutRef.current) && clearTimeout(timeoutRef.current));

  return () => {
    if (isNumber(timeoutRef.current)) return;

    if (isNumber(timeout))
      timeoutRef.current = setTimeout(() => timeoutRef.current = null, timeout);

    return true;
  };
}