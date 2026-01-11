import {useImperativeHandle, useRef} from "react";
import {isFinite} from "lodash";
import {PauseButton} from "../../../../entities/pause-button";
import {SoundButton} from "../../../../entities/sound-button";
import Image from "../../../../shared/ui/image/ui/main/Image";
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
          <div ref={ref => elements.lifes = ref} className={cl(styles.lifes, lifes.className)}>
            {lifes.background &&
              <div className={cl(styles.lifesBackground, lifes.background.className)}>
                <Image {...lifes.background.img}/>
              </div>
            }

            {isFinite(lifes.count) &&
              <div className={styles.lifesCount}>{lifes.count}</div>
            }

            {lifes.img &&
              <Image
                ref={ref => elements.lifesIcon = ref}
                {...lifes.img}
                className={cl(styles.statImg, lifes.img.className)}
              />
            }
          </div>
        }

        {score &&
          <div ref={ref => elements.score = ref} className={cl(styles.score, score.className)}>
            {score.background &&
              <div className={cl(styles.scoreBackground, score.background.className)}>
                <Image {...score.background.img}/>
              </div>
            }

            {isFinite(score.count) &&
              <div className={styles.scoreCount}>{score.count}</div>
            }

            {score.img &&
              <Image
                ref={ref => elements.scoreIcon = ref}
                {...score.img}
                className={cl(styles.statImg, score.img.className)}
              />
            }
          </div>
        }
      </div>

      {sound && <SoundButton {...sound} ref={ref => elements.sound = ref}/>}
    </div>
  );
}