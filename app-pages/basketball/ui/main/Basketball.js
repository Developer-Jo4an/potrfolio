"use client";
import {BasketballGame} from "../../../../widgets/basketball-game";
import styles from "./BasketballGame.scss";

export default function Basketball() {
  return (
    <section className={styles.basketball}>
      <BasketballGame/>
    </section>
  );
}