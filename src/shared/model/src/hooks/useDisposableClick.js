import {useRef} from "react";

export function useDisposableClick(onClick) {
  const isClicked = useRef(false);

  return function () {
    if (isClicked.current) return;
    isClicked.current = true;
    onClick?.(...arguments);
  };
}