import DunkShotTimer from "../timer/DunkShotTimer";
import DunkShotPureHit from "../pure-hit/DunkShotPureHit";
// import DunkShotStarGameElement from "./DunkShotStarGameElement";
// import DunkShotStarsGameElement from "./DunkShotStarsGameElement";
import styles from "./DunkShotGameElements.module.scss";

export default function DunkShotGameElements() {
  return (
    <div className={styles.dunkShotGameElements}>
      <DunkShotTimer/>
      <DunkShotPureHit/>
      {/*<DunkShotStarGameElement />*/}
      {/*<DunkShotStarsGameElement />*/}
    </div>
  );
}
