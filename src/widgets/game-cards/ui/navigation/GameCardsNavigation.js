import {Button} from "@shared";
import cl from "classnames";
import {upperFirst} from "lodash";
import {useGamesStore} from "../../model/state-manager/gamesStore";
import {navigationButtons} from "../../constants/content/navigationContent";
import styles from "./GameCardsNavigation.module.scss";

export function GameCardsNavigation() {
  const {activeGame, onSwipe} = useGamesStore();

  return (
    <div className={styles.gameCardsNavigation}>
      {navigationButtons.map(({id, Icon, ...otherProps}) => (
        <Button
          key={id}
          className={cl(styles.gameCardsNavigationButton, styles[`gameCardsNavigationButton${upperFirst(activeGame)}`])}
          events={{onClick: () => onSwipe({direction: id})}}
          {...otherProps}>
          <Icon />
        </Button>
      ))}
    </div>
  );
}
