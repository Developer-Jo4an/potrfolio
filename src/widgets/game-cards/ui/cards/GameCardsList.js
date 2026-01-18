import styles from "./GameCardsList.module.scss";
import {useRef} from "react";
import useGamesStore from "../../model/state-manager/gamesStore";
import GameCard from "../game-card/GameCard";
import {useCardFlipping} from "../../model/hooks/useCardFlipping";
import useCardShowing from "../../model/hooks/useCardShowing";

export default function GameCardsList() {
  const {gameList} = useGamesStore();
  const {current: gameCards} = useRef([]);

  useCardShowing({gameCards});

  return (
    <div className={styles.gameCardsList} {...useCardFlipping({gameCards})}>
      {gameList.map((gameData, index) =>
        <GameCard
          ref={ref => gameCards[index] = ref}
          key={index}
          gameData={gameData}
        />
      )}
    </div>
  );
}