import {useEffect, useRef} from "react";
import {isNumber} from "lodash";

export default function useCheckTimeout({timeout}) {
  const timeoutRef = useRef();

  useEffect(() => () => {
    if (isNumber(timeoutRef.current)) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [timeout]);

  return () => {
    if (isNumber(timeoutRef.current)) return false;

    if (isNumber(timeout))
      timeoutRef.current = setTimeout(() => timeoutRef.current = null, timeout);

    return true;
  };
}