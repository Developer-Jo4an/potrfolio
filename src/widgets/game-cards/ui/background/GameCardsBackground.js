import {useRef} from "react";
import {Image} from "@shared";
import cl from "classnames";
import {useGamesStore} from "../../model/state-manager/gamesStore";
import {gameList} from "../../config/cardsConfig";
import styles from "./GameCardsBackground.module.scss";

export function GameCardsBackground() {
  const {activeGame} = useGamesStore();
  const {current: cardsBackground} = useRef([]);

  return (
    <div className={styles.gameCardsBackground}>
      {gameList.map(({id, background}, index) => (
        <Image
          key={id}
          ref={(ref) => (cardsBackground[index] = ref)}
          className={cl(styles.gameCardBackgroundImage, {[styles.gameCardBackgroundImageVisible]: activeGame === id})}
          {...background}
        />
      ))}
    </div>
  );
}
