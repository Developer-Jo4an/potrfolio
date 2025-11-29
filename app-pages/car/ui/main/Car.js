"use client";
import {CarGame} from "../../../../widgets/car-game";
import styles from "./Car.scss";

export default function Car() {
  return (
    <section className={styles.dunkShot}>
      <CarGame/>
    </section>
  );
}