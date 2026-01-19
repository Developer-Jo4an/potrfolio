import {cardsAnimationSettings, cardsConfig} from "../../config/cardsConfig";
import {useGamesStore} from "../state-manager/gamesStore";
import {useLayoutEffect} from "react";

export function useCardShowing({gameCards}) {
  const {
    gameList,
    activeGame, leftGame, rightGame,
    setIsShowing
  } = useGamesStore();

  useLayoutEffect(() => {
    if (!gameList.length) return;

    const showingTimeline = gsap.timeline({onComplete: () => setIsShowing(false)});

    const visibleGames = [leftGame, activeGame, rightGame];
    const gamesObject = {leftGame, activeGame, rightGame};
    const keys = Object.keys(gamesObject);

    gameCards.forEach((gameCard, index) => {
      const gameData = gameList[index];

      const isVisible = visibleGames.includes(gameData.id);

      const cardStatus = keys.find(key => gamesObject[key] === gameData.id);

      gsap.set(gameCard, {
        opacity: 0,
        scale: isVisible ? 0.5 : 1,
        ...(isVisible
            ? {...cardsConfig[cardStatus]}
            : {visibility: "hidden"}
        )
      });

      if (isVisible)
        showingTimeline
        .to(gameCard, {
          opacity: 1,
          ease: "sine.in",
          duration: 0.2
        }, cardsAnimationSettings.showing[cardStatus])
        .to(gameCard, {
          scale: 1,
          ease: "back.out(2.5)",
          duration: 0.3
        }, "<");
    });

    return () => {
      setIsShowing(true);
      showingTimeline.kill();
    };
  }, [gameList.length]);
}