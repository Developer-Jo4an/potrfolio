"use client";
import {BasketballGame} from "../../../../widgets/basketball-game";
import styles from "./BasketballGame.module.scss";

function Basketball() {
  return (
    <section className={styles.basketball}>
      <BasketballGame/>
    </section>
  );
}

export {Basketball};