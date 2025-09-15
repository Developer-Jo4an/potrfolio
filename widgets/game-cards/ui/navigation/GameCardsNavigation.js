import {LEFT, RIGHT} from "../../../../shared/constants/directions/directions";
import Button from "../../../../shared/ui/button/ui/main/Button";
import cl from "classnames";
import {upperFirst} from "lodash/string";
import useGamesStore from "../../model/state-manager/gamesStore";
import styles from "./GameCardsNavigation.module.scss";
import {navigationButtons} from "../../constants/content/navigationContent";

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