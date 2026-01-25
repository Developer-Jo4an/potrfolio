import cl from "classnames";
import {ROUTES, Button, useAppCallbacks} from "@shared";
import {upperFirst} from "lodash/string";
import {useGamesStore} from "../../model/state-manager/gamesStore";
import content from "../../constants/content";
import styles from "./GameCardsButtons.module.scss";

const {button} = content;

export function GameCardsButtons() {
  const {activeGame} = useGamesStore();

  const allCallbacks = useAppCallbacks();

  const onClick = () => {
    if (activeGame) allCallbacks.redirect(ROUTES[activeGame]);
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
