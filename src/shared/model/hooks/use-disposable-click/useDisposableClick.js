import {useRef} from "react";

export const useDisposableClick = onClick => {
  const isClicked = useRef(false);

  return function () {
    if (isClicked.current) return;
    isClicked.current = true;
    onClick?.(...arguments);
  };
};