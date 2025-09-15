import styles from "../cards/GameCardsList.module.scss";
import {image} from "../../../../shared/lib/image/url";
import Image from "../../../../shared/ui/image/ui/main/Image";

export default function GameCard({ref, gameData}) {
  return (
    <div
      ref={ref}
      className={styles.gameCard}
      onClick={() => {
        console.log(1);
      }}
    >
      <Image
        src={`widgets/game-cards/cards/${gameData.id}.png`}
        className={styles.gameCardImg}
      />
    </div>
  );
}