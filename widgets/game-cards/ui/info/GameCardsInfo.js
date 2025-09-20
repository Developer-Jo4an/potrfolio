import styles from "./GameCardsInfo.module.scss";
import {ReactTyped} from "react-typed";
import {useRef} from "react";
import useGamesStore from "../../model/state-manager/gamesStore";
import cl from "classnames";
import {upperFirst} from "lodash/string";

export default function GameCardsInfo() {
  const {activeGame, gameList} = useGamesStore();
  const {current: typed} = useRef({title: null, description: null});

  const {title, description} = gameList.find(({id}) => id === activeGame) ?? {};

  return (
    <div className={styles.gameCardsInfo}>
      {title && <ReactTyped
        className={cl(
          styles.gameCardsTitle,
          styles[`gameCardsInfo${upperFirst(activeGame)}`]
        )}
        strings={[title]}
        typedRef={ref => typed.title = ref}
        showCursor={false}
        typeSpeed={40}
      />}

      {description && <ReactTyped
        className={cl(
          styles.gameCardsDescription,
          styles[`gameCardsInfo${upperFirst(activeGame)}`]
        )}
        strings={[description]}
        typedRef={ref => typed.description = ref}
        showCursor={false}
        typeSpeed={15}
      />}
    </div>
  );
}