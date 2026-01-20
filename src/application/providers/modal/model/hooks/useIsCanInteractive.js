import {useState} from "react";

export function useIsCanInteractive() {
  const [animationCount, setAnimationCount] = useState(0);

  return {
    isCanInteractive: !animationCount,
    handlers: {
      onAnimationStart() {
        setAnimationCount((prev) => ++prev);
      },
      onAnimationComplete() {
        setAnimationCount((prev) => Math.max(prev - 1, 0));
      },
    },
  };
}
