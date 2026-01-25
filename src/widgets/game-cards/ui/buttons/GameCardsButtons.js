import cl from "classnames";
import {ROUTES} from "@shared";
import {upperFirst} from "lodash/string";
import {useGamesStore} from "../../model/state-manager/gamesStore";
import content from "../../constants/content";
import {gameList} from "../../config/cardsConfig";
import Link from "next/link";
import styles from "./GameCardsButtons.module.scss";

const {button} = content;

export function GameCardsButtons() {
  const {activeGame} = useGamesStore();

  const href = gameList.find(({id}) => id === activeGame)?.route ?? ROUTES.index;

  return (
    <div className={styles.gameCardsButtons}>
      <Link prefetch={true} href={href} className={cl(styles.gameCardButton, styles[`gameCardButton${upperFirst(activeGame)}`])}>
        <span className={styles.gameCardButtonText}>{button.text}</span>
      </Link>
    </div>
  );
}
