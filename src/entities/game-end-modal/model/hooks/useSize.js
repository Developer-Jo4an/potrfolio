import {useLayoutEffect, useRef} from "react";
import {eventSubscription, RESIZE} from "@shared";
import gsap from "gsap";

const LIMITS = {
  width: {
    max: 500,
  },
  normalize: 0.9,
};

export function useSize() {
  const containerRef = useRef();

  useLayoutEffect(() => {
    const {current} = containerRef;

    const onResize = () => {
      const scale = Math.min(
        (global.innerWidth * LIMITS.normalize) / current.clientWidth,
        (global.innerHeight * LIMITS.normalize) / current.clientHeight,
        LIMITS.width.max / current.clientWidth,
      );

      gsap.set(current, {scale});
    };

    onResize();

    return eventSubscription({callbacksBus: [{event: RESIZE, callback: onResize}]});
  }, []);

  return containerRef;
}
