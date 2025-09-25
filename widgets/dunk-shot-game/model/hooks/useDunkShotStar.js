import {useRef} from "react";
import useKillGsapTweens from "../../../../shared/model/hooks/gsap/useKillGsapTweens";
import {HALF, SEVEN_TENTHS} from "../../../../shared/constants/numbers/numbers";
import {starAnimation} from "../../config/animations";
import gsap from "gsap";

const {offset, scale, delayBetween, opacity} = starAnimation;

export default function useDunkShotStar() {
  const tweenRefs = useRef({star: null});

  useKillGsapTweens(tweenRefs);

  return (stars, {x: xStart, y: yStart}, to) => {
    const {x: xEnd, y: yEnd} = to.getBoundingClientRect();

    const multiplier = xStart >= window?.innerWidth * HALF ? -1 : 1;
    const start = {x: 0, y: 0};
    const middle = {
      x: ((xEnd - xStart) / 2) + (offset.x * multiplier),
      y: ((yEnd - yStart) / 2) + offset.y
    };
    const end = {x: xEnd - xStart, y: yEnd - yStart};
    let isPlayedSound = false;

    if (tweenRefs.current.star)
      tweenRefs.current.star.kill();

    const starTween = tweenRefs.current.star = gsap.timeline({
      onUpdate() {
        if (this.progress() >= SEVEN_TENTHS && !isPlayedSound) {
          isPlayedSound = true;
          // SoundPlayer.playSingle("star")
        }
      },
      onComplete() {
        starTween.kill();
        tweenRefs.current.star = null;
      }
    });

    stars.forEach(star => gsap.set(star, {
      x: 0, y: 0,
      rotate: 0,
      left: xStart, top: yStart,
      opacity: 0
    }));

    stars.forEach((star, index, {length}) => {
      starTween.to(star, {
        opacity: opacity.max - ((index / length) * (opacity.max - opacity.min)),
        scale: scale.max - ((index / length) * (scale.max - scale.min)),
        duration: 0.2,
        ease: "none"
      }, index * delayBetween).to(
        star,
        {
          motionPath: {
            path: [start, middle, end],
            curviness: 1.75,
            autoRotate: false
          },
          duration: 1,
          ease: "none"
        }, "<").to(star, {
        opacity: 0,
        duration: 0.1,
        ease: "none"
      }, "-=0.1").to(star, {
        rotate: 720,
        duration: 1,
        ease: "sine.inOut"
      }, 0);
    });
  };
};
