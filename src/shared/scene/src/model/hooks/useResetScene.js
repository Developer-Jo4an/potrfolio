import {useEffect} from "react";

export function useResetScene({wrapper, extraCallback}) {
  useEffect(
    () => () => {
      if (!wrapper) return;

      wrapper.reset();
      extraCallback?.();
    },
    [wrapper],
  );
}
