import {useRef} from "react";

export const useDisposableClick = onClick => {
  const isClicked = useRef(false);

  return (...args) => {
    if (isClicked.current) return;
    isClicked.current = true;
    onClick?.(...args);
  };
};