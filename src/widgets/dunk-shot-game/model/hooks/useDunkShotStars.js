import {useRef} from "react";
import {useKillGsapTweens, useResetOnResize} from "@shared";
import {starsAnimation} from "../../config/animations";

const {offset, scale, delay, opacity} = starsAnimation;

export const useDunkShotStars = () => {
  const tweenRefs = useRef({stars: null});

  useResetOnResize(tweenRefs, {stars: null});
  useKillGsapTweens(tweenRefs);

  return (stars, from, to) => {
    const fromBounding = from.getBoundingClientRect();
    const toBounding = to.getBoundingClientRect();

    const {x: xStart, y: yStart} = fromBounding;
    const {x: xEnd, y: yEnd} = toBounding;
    let isPlayedSound = false;

    stars.forEach((starsGroup) => {
      starsGroup.forEach((star) => gsap.set(star, {x: 0, y: 0, rotate: 0, left: xStart, top: yStart, opacity: 0}));
    });

    if (tweenRefs.current.stars) tweenRefs.current.stars.kill();

    const startsTween = (tweenRefs.current.stars = gsap.timeline({
      onUpdate() {
        if (this.progress() > 0.3 && !isPlayedSound) {
          isPlayedSound = true;
          // SoundPlayer.playSingle("stars");
        }
      },
      onComplete() {
        tweenRefs.current.stars.kill();
        tweenRefs.current.stars = null;
      },
    }));

    stars.forEach((starsGroup, groupIndex) => {
      starsGroup.forEach((star, starIndex, {length: groupLength}) => {
        const multiplier = groupIndex % 2;
        const start = {x: 0, y: 0};
        const middle = {x: (xEnd - xStart) / 2 + offset.x * multiplier, y: (yEnd - yStart) / 2 + offset.y};
        const end = {x: xEnd - xStart, y: yEnd - yStart};

        startsTween
          .to(
            star,
            {
              opacity: opacity.max - (starIndex / groupLength) * (opacity.max - opacity.min),
              scale: scale.max - (starIndex / groupLength) * (scale.max - scale.min),
              duration: 0.2,
              ease: "none",
            },
            groupIndex * delay.betweenGroups + starIndex * delay.betweenStars,
          )
          .to(
            star,
            {motionPath: {path: [start, middle, end], curviness: 1.75, autoRotate: false}, duration: 0.5, ease: "none"},
            "<",
          )
          .to(star, {opacity: 0, duration: 0.1, ease: "none"}, "-=0.1")
          .to(star, {rotate: 720, duration: 0.6, ease: "none"}, groupIndex * delay.betweenGroups);
      });
    });
  };
};
