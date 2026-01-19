import {useEffect, useRef} from "react";
import {isFinite} from "lodash";

export function useCheckTimeout({timeout}) {
  const timeoutRef = useRef();

  useEffect(() => () => {
    if (isFinite(timeoutRef.current)) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [timeout]);

  return () => {
    if (isFinite(timeoutRef.current)) return false;

    if (isFinite(timeout))
      timeoutRef.current = setTimeout(() => timeoutRef.current = null, timeout);

    return true;
  };
}