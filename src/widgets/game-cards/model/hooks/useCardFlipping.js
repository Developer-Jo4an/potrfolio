import {useEffect} from "react";
import {useSwipeable} from "react-swipeable";
import {CENTER, LEFT, RIGHT, ACTIVE, INACTIVE} from "@shared";
import {useGamesStore} from "../state-manager/gamesStore";
import {cardsAnimationSettings, cardsConfig} from "../../config/cardsConfig";

export function useCardFlipping({gameCards}) {
  const {
    gameList,
    activeGame, leftGame, rightGame,
    isShowing,
    lastSwipeDirection,
    onSwipe
  } = useGamesStore();

  useEffect(() => {
    if (isShowing || !gameList.length || !lastSwipeDirection) return;

    const leftIndex = gameList.findIndex(({id}) => id === leftGame);
    const activeIndex = gameList.findIndex(({id}) => id === activeGame);
    const rightIndex = gameList.findIndex(({id}) => id === rightGame);

    const flippingTween = gsap.timeline();

    const visibleIndexes = [activeIndex, leftIndex, rightIndex];

    gameCards.forEach((gameCard, index) => {
      const gameCardStatus = getGameCardStatus(index, activeIndex, leftIndex, rightIndex);

      const necessaryConfig = cardsConfig[`${gameCardStatus}Game`];

      const isVisible = visibleIndexes.includes(index);

      flippingTween
      .to(gameCard, {
        opacity: Number(isVisible),
        ease: "sine.inOut",
        duration: 0.5,
        [isVisible ? "onStart" : "onComplete"]() {
          gsap.set(gameCard, {visibility: isVisible ? "visible" : "hidden"});
        }
      }, 0);

      const {translateX, translateZ, ...otherProps} = necessaryConfig;
      const availableStatusesForMotionTween = [ACTIVE, lastSwipeDirection].includes(gameCardStatus);

      flippingTween
      .to(gameCard, {
        ease: "sine.inOut",
        duration: 0.5,
        ...otherProps,
        ...(!availableStatusesForMotionTween && {translateX, translateZ})
      }, 0);

      if (!availableStatusesForMotionTween) return;

      const start = {
        translateX: gsap.getProperty(gameCard, "translateX"),
        translateZ: gsap.getProperty(gameCard, "translateZ")
      };

      const middle = cardsAnimationSettings.flipping[({
        [ACTIVE]: () => `${lastSwipeDirection === RIGHT ? LEFT : RIGHT}${CENTER}`,
        [lastSwipeDirection]: () => `${lastSwipeDirection}${CENTER}`
      })[gameCardStatus]()];

      const end = {translateX, translateZ};

      flippingTween.to(gameCard, {
        motionPath: {
          path: [start, middle, end],
          autoRotate: false,
          curviness: 1.5
        },
        ease: "sine.out",
        duration: 0.5
      }, 0);
    });

    return () => {
      flippingTween.progress(1);
      flippingTween.kill();
    };
  }, [isShowing, gameList, activeGame, leftGame, rightGame, lastSwipeDirection]);

  return useSwipeable({
    trackMouse: true,
    onSwiped({dir}) {
      const direction = dir.toLowerCase();
      if (!isShowing && gameList.length && [RIGHT, LEFT].includes(direction))
        onSwipe({direction});
    }
  });
}

function getGameCardStatus(index, activeIndex, leftIndex, rightIndex) {
  if (index === activeIndex) return ACTIVE;
  if (index === leftIndex) return LEFT;
  if (index === rightIndex) return RIGHT;
  return INACTIVE;
}