"use client";
import {DunkShotGame} from "../../../../widgets/dunk-shot-game";
import styles from "./DunkShot.module.scss";

function DunkShot() {
  return (
    <section className={styles.dunkShot}>
      <DunkShotGame />
    </section>
  );
}

export {DunkShot};
