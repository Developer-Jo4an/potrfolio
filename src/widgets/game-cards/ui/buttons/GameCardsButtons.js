import cl from "classnames";
import {Button} from "@shared";
import {useAppCallbacks} from "@application/providers/callbacks";
import {upperFirst} from "lodash/string";
import {useGamesStore} from "../../model/state-manager/gamesStore";
import {buttonContent} from "../../constants/content/buttonContent";
import {ROUTES} from "../../constants/routes";
import styles from "./GameCardsButtons.module.scss";

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
        <span className={styles.gameCardButtonText}>{buttonContent.text}</span>
      </Button>
    </div>
  );
}
