import styles from "./BasketballGame.module.scss";
import {BasketballGame} from "@widgets/basketball-game";

export function Basketball() {
  return (
    <section className={styles.basketball}>
      <BasketballGame/>
    </section>
  );
}
