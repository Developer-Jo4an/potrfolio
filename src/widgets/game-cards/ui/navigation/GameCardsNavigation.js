import {Button} from "@shared";
import cl from "classnames";
import {upperFirst} from "lodash";
import {useGamesStore} from "../../model/state-manager/gamesStore";
import content from "../../constants/content";
import styles from "./GameCardsNavigation.module.scss";

const {navigation} = content;

export function GameCardsNavigation() {
  const {activeGame, onSwipe} = useGamesStore();

  return (
    <div className={styles.gameCardsNavigation}>
      {navigation.map(({id, Icon, ...otherProps}) => (
        <Button
          key={id}
          className={cl(styles.gameCardsNavigationButton, styles[`gameCardsNavigationButton${upperFirst(activeGame)}`])}
          events={{onClick: () => onSwipe({direction: id})}}
          {...otherProps}>
          <Icon/>
        </Button>
      ))}
    </div>
  );
}
