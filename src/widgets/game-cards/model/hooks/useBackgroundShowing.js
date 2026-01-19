import {useEffect} from "react";
import {useGamesStore} from "../state-manager/gamesStore";

export function useBackgroundShowing({cardsBackground}) {
  const {gameList, isShowing} = useGamesStore();

  useEffect(() => {
    if (!gameList?.length || isShowing) return;

    const showingTimeline = gsap.timeline();

    cardsBackground.forEach(cardBackground => {
      showingTimeline.to(cardBackground, {
        filter: "blur(5px)",
        ease: "sine.inOut",
        duration: 0.5
      }, 0);
    });

    return () => showingTimeline.kill();
  }, [gameList, isShowing]);
}