"use client";
import {GameCards} from "../../../../widgets/game-cards";
import styles from "./Adjustable.module.scss";

export default function Adjustable() {
  return (
    <div className={styles.adjustable}>
      <GameCards/>
    </div>
  );
}
