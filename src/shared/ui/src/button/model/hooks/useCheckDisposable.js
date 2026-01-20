import {useRef} from "react";

export function useCheckDisposable({isDisposable}) {
  const isClicked = useRef(false);

  return () => {
    if (isClicked.current) return false;

    if (isDisposable) isClicked.current = true;

    return true;
  };
}
