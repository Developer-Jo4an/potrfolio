import {ProgressBar, MODES} from "@entities/progress-bar";
import {useDunkShotStore} from "../../model/state-manager/dunkShotStore";
import styles from "./Progress.module.scss";

export function Progress({updateProps}) {
  const {gameData: {progress: {min, current, max} = {}} = {}} = useDunkShotStore();
  return (
    <div className={styles.progress}>
      <ProgressBar updateProps={updateProps} count={current} progress={current / (max - min)} mode={MODES.ocean} />
    </div>
  );
}
