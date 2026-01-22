import {useRef} from "react";

export function useIsFirstEntry() {
  const isFirstEntry = useRef(true);

  return [isFirstEntry.current, () => (isFirstEntry.current = false)];
}
