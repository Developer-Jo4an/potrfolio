import {CarGame} from "@widgets/car-game";
import styles from "./Car.module.scss";

export function Car() {
  return (
    <section className={styles.car}>
      <CarGame />
    </section>
  );
}
