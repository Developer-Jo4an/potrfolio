import {useEffect, useRef} from "react";
import {FaStar} from "react-icons/fa6";
import {isFinite} from "lodash";
import styles from "./ProgressBar.module.scss";

export function ProgressBar({count, progress, mode, updateProps}) {
  const {current: elements} = useRef({scale: null, score: null, counter: null});

  useEffect(() => {
    updateProps({progressBar: elements});
  }, []);

  return (
    <div className={styles.progressBar} data-mod={mode}>
      {isFinite(progress) && (
        <div ref={(ref) => (elements.scale = ref)} className={styles.progressScale} style={{"--progress": progress}}/>
      )}

      <div ref={(ref) => (elements.score = ref)} className={styles.progressBarScore}>
        <FaStar/>
      </div>

      {isFinite(count) && (
        <div ref={(ref) => (elements.counter = ref)} className={styles.progressBarCounter}>
          {count}
        </div>
      )}
    </div>
  );
}
