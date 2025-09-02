import {useRef} from "react";

export default function useCheckDisposable({isDisposable}) {
  const isClicked = useRef(false);

  return () => {
    if (isClicked.current) return;

    if (isDisposable)
      isClicked.current = true;

    return true;
  };
}