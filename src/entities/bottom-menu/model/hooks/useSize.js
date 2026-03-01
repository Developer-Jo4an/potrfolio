import {useCallback, useRef} from "react";
import {useOnResize} from "@shared";
import gsap from "gsap";

const LIMITS = {
  width: {
    max: 500,
  },
};

export function useSize() {
  const containerRef = useRef();

  useOnResize(
    useCallback(() => {
      const {current} = containerRef;

      const scale = Math.min(
        global.innerWidth / current.clientWidth,
        global.innerHeight / current.clientHeight,
        LIMITS.width.max / current.clientWidth,
      );

      gsap.set(current, {scale});
    }, []),
  );

  return containerRef;
}
