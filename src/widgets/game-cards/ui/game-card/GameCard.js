import {Image} from "@shared";
import styles from "../cards/GameCardsList.module.scss";

export function GameCard({ref, gameData}) {
  return (
    <div ref={ref} className={styles.gameCard}>
      <Image
        src={`widgets/game-cards/cards/${gameData.id}.png`}
        className={styles.gameCardImg}
      />
    </div>
  );
}