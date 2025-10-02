import {Image} from "../../../../shared/ui/image";
import {formatStatValue} from "../../lib/format";
import styles from "./Stat.module.scss";
import content from "../../constants/content";

export default function Stat({label, value, image, Icon, imageDirectory}) {
  return (
    <div className={styles.stat}>
      <p className={styles.statName}>{`${content.statsNames[label]}:`}</p>
      <div className={styles.statInfo}>
        {image && <Image src={`widgets/${imageDirectory}/stats/${label}.png`} className={styles.statImage}/>}
        {Icon && <Icon className={styles.statSign}/>}
        <div className={styles.statValue}>{formatStatValue(label, value)}</div>
      </div>
    </div>
  )
}