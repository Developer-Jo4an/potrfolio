import {GameCards} from "@widgets/game-cards";
import styles from "./Adjustable.module.scss";

export function Adjustable() {
  return (
    <div className={styles.adjustable}>
      <GameCards/>
    </div>
  );
}
