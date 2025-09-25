import DunkShotTimer from "../timer/DunkShotTimer";
import DunkShotPureHit from "../pure-hit/DunkShotPureHit";
import DunkShotStar from "../star/DunkShotStar";
import DunkShotStars from "../stars/DunkShotStars";
import styles from "./DunkShotGameElements.module.scss";

export default function DunkShotGameElements({topMenuEls, progressBarEls}) {
  return (
    <div className={styles.dunkShotGameElements}>
      <DunkShotTimer/>
      <DunkShotPureHit/>
      <DunkShotStar topMenuEls={topMenuEls}/>
      <DunkShotStars topMenuEls={topMenuEls} progressBarEls={progressBarEls}/>
    </div>
  );
}
