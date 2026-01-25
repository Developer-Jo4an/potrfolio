import cl from "classnames";
import {Button, useAppCallbacks} from "@shared";
import {upperFirst} from "lodash/string";
import {useGamesStore} from "../../model/state-manager/gamesStore";
import content from "../../constants/content";
import {gameList} from "../../config/cardsConfig";
import styles from "./GameCardsButtons.module.scss";

const {button} = content;

export function GameCardsButtons() {
  const {activeGame} = useGamesStore();

  const allCallbacks = useAppCallbacks();

  const onClick = () => {
    if (activeGame) {
      const route = gameList.find(({id}) => id === activeGame)?.route;
      route && allCallbacks.redirect(route);
    }
  };

  return (
    <div className={styles.gameCardsButtons}>
      <Button
        className={cl(styles.gameCardButton, styles[`gameCardButton${upperFirst(activeGame)}`])}
        events={{onClick}}>
        <span className={styles.gameCardButtonText}>{button.text}</span>
      </Button>
    </div>
  );
}
