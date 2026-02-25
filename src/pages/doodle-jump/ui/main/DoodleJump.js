import {DoodleJumpGame} from "@widgets/doodle-jump-game";
import styles from "./DoodleJump.module.scss";

export function DoodleJump() {
  return (
    <section className={styles.dunkShot}>
      <DoodleJumpGame/>
    </section>
  );
}
