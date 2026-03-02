import {useCallback, useRef} from "react";
import {useOnResize} from "@shared";
import gsap from "gsap";

const LIMITS = {
  normalize: {
    width: 1.4,
    height: 1,
  },
  max: {
    width: 2000,
  },
  screen: {
    borderWidth: 320,
    borderHeight: 568,
  },
};

export function useCardsSize() {
  const containerRef = useRef();

  useOnResize(
    useCallback(() => {
      const {current} = containerRef;

      if (global.innerWidth > LIMITS.screen.borderWidth && global.innerHeight > LIMITS.screen.borderHeight) {
        const scale = Math.min(
          global.innerWidth / LIMITS.screen.borderWidth,
          global.innerHeight / LIMITS.screen.borderHeight,
          1.5,
        );

        gsap.set(current, {scale});
      } else {
        gsap.set(current, {scale: 1});
      }
    }, []),
  );

  return containerRef;
}
