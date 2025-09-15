import Button from "../../../../shared/ui/button/ui/main/Button";
import styles from "./GameCardsButtons.module.scss";
import cl from "classnames";
import {upperFirst} from "lodash/string";
import useGamesStore from "../../model/state-manager/gamesStore";
import {buttonContent} from "../../constants/content/buttonContent";

export default function GameCardsButtons() {
  const {activeGame} = useGamesStore();

  const onClick = () => {

  };

  return (
    <div className={styles.gameCardsButtons}>
      <Button
        className={cl(styles.gameCardButton, styles[`gameCardButton${upperFirst(activeGame)}`])}
        events={{onClick}}
      >
        <span className={styles.gameCardButtonText}>{buttonContent.text}</span>
      </Button>
    </div>
  );
}