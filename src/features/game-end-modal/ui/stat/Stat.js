import {Image} from "@shared";
import {isNil} from "lodash";
import styles from "./Stat.module.scss";

export function Stat({label, value, mod, img}) {
  return (
    <div className={styles.stat} data-mod={mod}>
      <p className={styles.statName}>{`${label}:`}</p>
      <div className={styles.statInfo}>
        {img && <Image src={img} className={styles.statImage}/>}
        {!isNil(value) && <div className={styles.statValue}>{value}</div>}
      </div>
    </div>
  );
}