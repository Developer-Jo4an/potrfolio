import {useEffect} from "react";
import gsap from "gsap";

export function useCardFlipping({gameCards}) {
  useEffect(() => {
    gameCards.forEach((gC, index, {length}) => {
      const startAngle = -Math.PI / 2;
      const angle = startAngle + index * (Math.PI * 2 / length);
      const x = 200 * Math.cos(angle);
      const z = -200 * Math.sin(angle);
      gsap.set(gC, {translateX: x, translateZ: z, translateY: -20 * index});
    });
  }, []);
}