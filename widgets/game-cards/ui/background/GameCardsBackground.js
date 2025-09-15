import useGamesStore from "../../model/state-manager/gamesStore";
import styles from "./GameCardsBackground.module.scss";
import cl from "classnames";
import Image from "../../../../shared/ui/image/ui/main/Image";
import useBackgroundShowing from "../../model/hooks/useBackgroundShowing";

export default function GameCardsBackground() {
  const {gameList, activeGame} = useGamesStore();

  useBackgroundShowing();

  return (
    <div className={styles.gameCardsBackground}>
      {gameList.map(({id}) => (
        <Image
          key={id}
          className={cl(
            styles.gameCardBackgroundImage,
            {[styles.gameCardBackgroundImageVisible]: activeGame === id}
          )}
          src={`widgets/game-cards/backgrounds/${id}.png`}
        />
      ))}
    </div>
  );
}