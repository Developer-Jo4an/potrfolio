"use client";
import {CarGame} from "../../../../widgets/car-game";
import styles from "./Car.module.scss";

function Car() {
  return (
    <section className={styles.car}>
      <CarGame />
    </section>
  );
}

export {Car};
