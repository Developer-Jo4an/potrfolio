import {useEffect} from "react";
import {useGamesStore} from "../state-manager/gamesStore";

export function useBackgroundShowing({cardsBackground}) {
  const {isShowing} = useGamesStore();

  useEffect(() => {
    if (isShowing) return;

    const showingTimeline = gsap.timeline();

    cardsBackground.forEach((cardBackground) => {
      //TODO: дороговато, но красиво
      showingTimeline.to(cardBackground, {filter: "blur(5px)", ease: "sine.inOut", duration: 0.5}, 0);
    });

    return () => showingTimeline.kill();
  }, [isShowing]);
}
