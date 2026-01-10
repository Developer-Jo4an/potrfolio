import styles from "../cards/GameCardsList.module.scss";
import {Image} from "../../../../shared/ui/image";

export default function GameCard({ref, gameData}) {
  return (
    <div ref={ref} className={styles.gameCard}>
      <Image
        src={`widgets/game-cards/cards/${gameData.id}.png`}
        className={styles.gameCardImg}
      />
    </div>
  );
}