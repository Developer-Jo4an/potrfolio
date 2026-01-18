import {Button} from "../../../../shared/ui/button";
import cl from "classnames";
import useGamesStore from "../../model/state-manager/gamesStore";
import {upperFirst} from "lodash/string";
import {navigationButtons} from "../../constants/content/navigationContent";
import styles from "./GameCardsNavigation.module.scss";

export default function GameCardsNavigation() {
  const {activeGame, onSwipe} = useGamesStore();

  return (
    <div className={styles.gameCardsNavigation}>
      {navigationButtons.map(({id, Icon, ...otherProps}) => (
        <Button
          key={id}
          className={cl(styles.gameCardsNavigationButton, styles[`gameCardsNavigationButton${upperFirst(activeGame)}`])}
          events={{onClick: () => onSwipe({direction: id})}}
          {...otherProps}
        >
          <Icon/>
        </Button>
      ))}
    </div>
  );
}