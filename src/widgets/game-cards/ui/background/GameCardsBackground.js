import {useRef} from "react";
import {Image} from "@shared";
import cl from "classnames";
import {useBackgroundShowing} from "../../model/hooks/useBackgroundShowing";
import {useGamesStore} from "../../model/state-manager/gamesStore";
import styles from "./GameCardsBackground.module.scss";

export function GameCardsBackground() {
  const {gameList, activeGame} = useGamesStore();
  const {current: cardsBackground} = useRef([]);

  useBackgroundShowing({cardsBackground});

  return (
    <div className={styles.gameCardsBackground}>
      {gameList.map(({id}, index) => (
        <Image
          key={id}
          ref={ref => cardsBackground[index] = ref}
          className={cl(
            styles.gameCardBackgroundImage,
            {[styles.gameCardBackgroundImageVisible]: activeGame === id}
          )}
          src={`widgets/game-cards/backgrounds/${id}.png`}
        />
      ))}
    </div>
  );
}