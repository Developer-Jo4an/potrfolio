import {useEffect} from "react";

export default function useResetGame({wrapper, callbackKey = "reset", callback: extraCallback}) {
  useEffect(() => () => {
    if (wrapper) {
      wrapper.controller[callbackKey]?.();
      extraCallback?.();
    }
  }, [wrapper]);
};
