import {BasketballGame} from "@widgets/basketball-game";
import styles from "./BasketballGame.module.scss";

export function Basketball() {
  return (
    <section className={styles.basketball}>
      <BasketballGame/>
    </section>
  );
}
