import styles from "./GameCardsList.module.scss";
import {useEffect, useRef} from "react";
import useGamesStore from "../../model/state-manager/gamesStore";
import GameCard from "../game-card/GameCard";
import {useCardFlipping} from "../../model/hooks/useCardFlipping";

export default function GameCardsList() {
  const {gameList} = useGamesStore();
  const {current: gameCards} = useRef([]);

  useCardFlipping({gameCards});

  return (
    <div className={styles.gameCardsList}>
      {new Array(10).fill(gameList[0] ?? {}).map((gameData, index) =>
        <GameCard
          ref={ref => gameCards[index] = ref}
          key={index}
          gameData={gameData}
        />
      )}
    </div>
  );
}