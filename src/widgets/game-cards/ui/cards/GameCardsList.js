import {useRef} from "react";
import {GameCard} from "../game-card/GameCard";
import {useCardFlipping} from "../../model/hooks/useCardFlipping";
import {useCardShowing} from "../../model/hooks/useCardShowing";
import {useGamesStore} from "../../model/state-manager/gamesStore";
import styles from "./GameCardsList.module.scss";

export function GameCardsList() {
  const {gameList} = useGamesStore();
  const {current: gameCards} = useRef([]);

  useCardShowing({gameCards});

  return (
    <div className={styles.gameCardsList} {...useCardFlipping({gameCards})}>
      {gameList.map((gameData, index) => (
        <GameCard ref={(ref) => (gameCards[index] = ref)} key={index} gameData={gameData} />
      ))}
    </div>
  );
}
