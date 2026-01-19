import {Stat} from "../stat/Stat";
import styles from "./Stats.module.scss";

export function Stats({list, mod}) {
  return (
    <div className={styles.stats}>
      {list.map((stat, index) => <Stat key={index} mod={mod} {...stat}/>)}
    </div>
  );
}