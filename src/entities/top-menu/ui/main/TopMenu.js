import {useEffect, useRef} from "react";
import {isNil, isObject} from "lodash";
import {PauseButton} from "../../../pause-button";
import {SoundButton} from "../../../sound-button";
import {Image} from "@shared";
import {useSize} from "../../model/hooks/useSize";
import cl from "classnames";
import styles from "./TopMenu.module.scss";

export function TopMenu({className, content, gameSpace, pause, sound, updateProps, children}) {
  const {current: elements} = useRef({
    pause: null,
    lifes: null,
    lifesIcon: null,
    scoreIcon: null,
    score: null,
    sound: null,
  });

  const lifes = isFinite(gameSpace.gameData?.lifes) && {count: gameSpace.gameData?.lifes, ...content.menu.lifes};
  const score = isFinite(gameSpace.gameData?.score) && {count: gameSpace.gameData?.score, ...content.menu.score};

  useEffect(() => {
    updateProps({topMenu: elements});
  }, []);

  const containerRef = useSize();

  return (
    <div className={cl(styles.topMenu, className)} ref={containerRef}>
      {isObject(pause) && (
        <PauseButton {...pause} className={cl(pause.className, styles.pause)} ref={(ref) => (elements.pause = ref)} />
      )}

      <div className={styles.topNavStats}>
        {isObject(lifes) && (
          <div ref={(ref) => (elements.lifes = ref)} className={cl(styles.lifes, lifes.className)}>
            {isObject(lifes.background) && (
              <div className={cl(styles.lifesBackground, lifes.background.className)}>
                <Image {...lifes.background.img} />
              </div>
            )}

            {!isNil(lifes.count) && <div className={styles.lifesCount}>{lifes.count}</div>}

            {isObject(lifes.img) && (
              <Image
                ref={(ref) => (elements.lifesIcon = ref)}
                {...lifes.img}
                className={cl(styles.statImg, lifes.img.className)}
              />
            )}
          </div>
        )}

        {isObject(score) && (
          <div ref={(ref) => (elements.score = ref)} className={cl(styles.score, score.className)}>
            {isObject(score.background) && (
              <div className={cl(styles.scoreBackground, score.background.className)}>
                <Image {...score.background.img} />
              </div>
            )}

            {!isNil(score.count) && <div className={styles.scoreCount}>{score.count}</div>}

            {isObject(score.img) && (
              <Image
                ref={(ref) => (elements.scoreIcon = ref)}
                {...score.img}
                className={cl(styles.statImg, score.img.className)}
              />
            )}
          </div>
        )}
      </div>

      {isObject(sound) && (
        <SoundButton {...sound} className={cl(sound.className, styles.sound)} ref={(ref) => (elements.sound = ref)} />
      )}

      {children}
    </div>
  );
}
