import styles from "../cards/GameCardsList.module.scss";
import {image} from "../../../../shared/lib/image/url";

export default function GameCard({ref, gameData}) {
  return (
    <div
      ref={ref}
      className={styles.gameCard}
      onClick={() => {
        console.log(1);
      }}
    >
      <img
        className={styles.gameCardImg}
        src={image(`widgets/game-cards/${gameData.id}.png`)}
      />
    </div>
  );
}