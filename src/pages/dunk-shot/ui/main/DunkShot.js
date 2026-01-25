import {DunkShotGame} from "@widgets/dunk-shot-game";
import styles from "./DunkShot.module.scss";

export function DunkShot() {
  return (
    <section className={styles.dunkShot}>
      <DunkShotGame />
    </section>
  );
}
