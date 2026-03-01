import {Image} from "@shared";
import styles from "../cards/GameCardsList.module.scss";

export function GameCard({ref, gameData: {img}}) {
  return (
    <div ref={ref} className={styles.gameCard}>
      <Image {...img} className={styles.gameCardImg} />
    </div>
  );
}
