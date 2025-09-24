import useGamesStore from "../../model/state-manager/gamesStore";
import styles from "./GameCardsBackground.module.scss";
import cl from "classnames";
import {Image} from "../../../../shared/ui/image";
import useBackgroundShowing from "../../model/hooks/useBackgroundShowing";
import {useRef} from "react";

export default function GameCardsBackground() {
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