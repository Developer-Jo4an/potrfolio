import {Glow} from "../../../../shared/ui/glow";
import {Image} from "../../../../shared/ui/image";
import {formatStats} from "../../lib/format";
import Stat from "../stat/Stat";
import {Button} from "../../../../shared/ui/button";
import cl from "classnames";
import content from "../../constants/content";
import styles from "./GameEndModal.module.scss";

export default function GameEndModal({modalProps: {status, imageDirectory, game, stats, actions}}) {
  const formattedStats = formatStats(stats);

  return (
    <div className={styles.gameEndModal}>
      <div className={styles.imageContainer}>
        <Glow/>
        <Image src={`widgets/${imageDirectory}/end-game/${status}.png`} className={styles.image}/>
      </div>

      <p className={styles.title}>{content.title[status]}</p>

      <div className={styles.stats}>
        {formattedStats.map(({key, image, Icon, value}) => (
          <Stat key={key} label={key} imageDirectory={imageDirectory} image={image} Icon={Icon} value={value}/>)
        )}
      </div>

      <div className={styles.buttons}>
        {content.buttons.map(({id, text, className}) => (
          <Button key={id} className={cl(styles.button, styles[className])} events={{onClick: actions[id]}}>
            {text}
          </Button>
        ))}
      </div>
    </div>
  );
}