import {Timer} from "../timer/Timer";
import {PureHit} from "../pure-hit/PureHit";
import {Star} from "../star/Star";
import {Stars} from "../stars/Stars";
import styles from "./Elements.module.scss";

export function Elements() {
  return (
    <div className={styles.elements}>
      <Timer {...arguments[0]}/>
      <PureHit {...arguments[0]}/>
      <Star {...arguments[0]} />
      <Stars {...arguments[0]}/>
    </div>
  );
}
