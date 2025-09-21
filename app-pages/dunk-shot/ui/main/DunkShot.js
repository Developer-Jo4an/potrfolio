"use client";
import styles from "./DunkShot.module.scss";
import DunkShotGame from "../../../../widgets/dunk-shot-game/ui/main/DunkShotGame";

export default function DunkShot() {
  return (
    <section className={styles.dunkShot}>
      <DunkShotGame/>
    </section>
  );
}