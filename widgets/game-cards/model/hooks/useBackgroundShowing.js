import {useEffect} from "react";
import gsap from "gsap";
import useGamesStore from "../state-manager/gamesStore";

export default function useBackgroundShowing({cardsBackground}) {
  const {gameList} = useGamesStore();

  useEffect(() => {
    if (!gameList?.length) return;

    const showingTimeline = gsap.timeline();

    cardsBackground.forEach(cardBackground => {
      showingTimeline.to(cardBackground, {
        filter: "blur(5px)",
        ease: "sine.inOut",
        duration: 1
      }, 0);
    });

    return showingTimeline.kill;
  }, [gameList]);
}