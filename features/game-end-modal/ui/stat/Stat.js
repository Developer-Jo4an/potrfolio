import {Image} from "../../../../shared/ui/image";
import styles from "./Stat.module.scss";

export default function Stat({label, value, mod, img, Icon}) {
  return (
    <div className={styles.stat} data-mod={mod}>
      <p className={styles.statName}>{`${label}:`}</p>
      <div className={styles.statInfo}>
        {img && <Image src={img} className={styles.statImage}/>}
        {Icon && <Icon className={styles.statSign}/>}
        {value && <div className={styles.statValue}>{value}</div>}
      </div>
    </div>
  );
}