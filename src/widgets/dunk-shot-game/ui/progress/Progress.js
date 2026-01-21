import {ProgressBar, MODES} from "@features/progress-bar";
import {useDunkShotStore} from "../../model/state-manager/dunkShotStore";
import styles from "./Progress.module.scss";

export function Progress({progressBarEls}) {
  const {gameData: {progress: {min, current, max} = {}} = {}} = useDunkShotStore();
  return (
    <div className={styles.progress}>
      <ProgressBar ref={progressBarEls} count={current} progress={current / (max - min)} mode={MODES.ocean} />
    </div>
  );
}
