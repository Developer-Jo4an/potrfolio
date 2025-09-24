import {useImperativeHandle, useRef} from "react";
import {FaHeart} from "react-icons/fa";
import {FaStar} from "react-icons/fa6";
import {isNumber} from "lodash";
import {PauseButton} from "../../../../entities/pause-button";
import {SoundButton} from "../../../../entities/sound-button";
import cl from "classnames";
import styles from "./TopMenu.module.scss";

export default function TopMenu({className, pause, sound, lifes, score, ref}) {
  const {current: elements} = useRef({
    pause: null,
    lifes: null,
    lifesIcon: null,
    scoreIcon: null,
    score: null,
    sound: null
  });

  useImperativeHandle(ref, () => elements);

  return (
    <div className={cl(styles.topMenu, className)}>
      {pause && <PauseButton {...pause} ref={ref => elements.pause = ref}/>}

      <div className={styles.topNavStats}>
        {lifes &&
          <div ref={ref => elements.lifes = ref} className={styles.lifes}>
            <FaHeart ref={ref => elements.lifesIcon = ref}/>
            {isNumber(lifes?.count) && <div className={styles.lifesCount}>{lifes.count}</div>}
          </div>
        }

        {score &&
          <div ref={ref => elements.score = ref} className={styles.score}>
            <FaStar ref={ref => elements.scoreIcon = ref}/>
            {isNumber(score?.count) && <div className={styles.scoreCount}>{score.count}</div>}
          </div>
        }
      </div>

      {sound && <SoundButton {...sound} ref={ref => elements.sound = ref}/>}
    </div>
  );
}