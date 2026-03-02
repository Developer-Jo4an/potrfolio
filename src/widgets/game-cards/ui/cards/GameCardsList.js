import {useRef} from "react";
import {GameCard} from "../game-card/GameCard";
import {useCardFlipping} from "../../model/hooks/useCardFlipping";
import {useCardShowing} from "../../model/hooks/useCardShowing";
import {useCardsSize} from "../../model/hooks/useCardsSize";
import {gameList} from "../../config/cardsConfig";
import styles from "./GameCardsList.module.scss";

export function GameCardsList() {
  const {current: gameCards} = useRef([]);

  useCardShowing({gameCards});

  const containerRef = useCardsSize();

  return (
    <div ref={containerRef} className={styles.gameCardsListWrapper}>
      <div className={styles.gameCardsList} {...useCardFlipping({gameCards})}>
        {gameList.map((gameData, index) => (
          <GameCard ref={(ref) => (gameCards[index] = ref)} key={index} gameData={gameData} />
        ))}
      </div>
    </div>
  );
}
