import {useImperativeHandle, useRef} from "react";
import {FaStar} from "react-icons/fa6";
import {isFinite} from "lodash";
import styles from "./ProgressBar.module.scss";

export function ProgressBar({count, progress, ref}) {
  const {current: elements} = useRef({scale: null, score: null, counter: null});

  useImperativeHandle(ref, () => elements);

  return (
    <div className={styles.progressBar}>
      {isFinite(progress) && (
        <div ref={(ref) => (elements.scale = ref)} className={styles.progressScale} style={{"--progress": progress}} />
      )}

      <div ref={(ref) => (elements.score = ref)} className={styles.progressBarScore}>
        <FaStar />
      </div>

      {isFinite(count) && (
        <div ref={(ref) => (elements.counter = ref)} className={styles.progressBarCounter}>
          {count}
        </div>
      )}
    </div>
  );
}
