import {useEffect} from "react";

export default function useResetGame({wrapper, callbackKey = "reset", callback: extraCallback}) {
  useEffect(() => async () => {
    if (wrapper) {
      await wrapper[callbackKey]?.();
      extraCallback?.();
    }
  }, [wrapper]);
};
