import {Timer} from "../timer/Timer";
import {PureHit} from "../pure-hit/PureHit";
import {Star} from "../star/Star";
import {Stars} from "../stars/Stars";
import styles from "./Elements.module.scss";

export function Elements({topMenuElementsRef, progressBarEls}) {
  return (
    <div className={styles.elements}>
      <Timer />
      <PureHit />
      <Star topMenuElementsRef={topMenuElementsRef} />
      <Stars topMenuElementsRef={topMenuElementsRef} progressBarEls={progressBarEls} />
    </div>
  );
}
