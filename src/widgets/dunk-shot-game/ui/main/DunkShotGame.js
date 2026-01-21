import {useRef} from "react";
import {useLoadDunkShotScene} from "../../model/hooks/useLoadDunkShotScene";
import {Background} from "../walls/Background";
import {DunkShotGameElements} from "../game-elements/DunkShotGameElements";
import {ProgressBar} from "@features/progress-bar";
import {Loader} from "@shared";
import {DunkShotBoosters} from "../boosters/DunkShotBoosters";
import {TopMenu} from "../../../../features/top-menu";
import {useDunkShotStore} from "../../model/state-manager/dunkShotStore";
import {DUNK_SHOT_STATE_MACHINE} from "../../constants/stateMachine";
import styles from "./DunkShotGame.module.scss";

export function DunkShotGame() {
  const {gameData: {state, lifes, score, progress: {min, current, max} = {}} = {}} = useDunkShotStore();
  const {containerRef, isCanPressPause, onPause} = useLoadDunkShotScene();
  const topMenuEls = useRef();
  const progressBarEls = useRef();

  //TopMenu
  //         ref={topMenuElementsRef}
  //         lifes={{count: gameSpace.gameData.lifes, ...lifes}}
  //         score={{count: gameSpace.gameData.score, ...score}}
  //         sound={sound}
  //         pause={pause}
  //       />

  return (
    <>
      <div ref={containerRef} className={styles.dunkShotContainer}>
        <TopMenu
          ref={topMenuEls}
          lifes={{count: lifes}}
          pause={{events: {onClick: isCanPressPause && onPause}}}
          sound={true}
          score={{count: score}}
        />
        <ProgressBar count={current} progress={current / (max - min)} ref={progressBarEls} />
        <DunkShotBoosters />
      </div>
      <Background />
      <DunkShotGameElements topMenuEls={topMenuEls} progressBarEls={progressBarEls} />
      <Loader isPending={!state || DUNK_SHOT_STATE_MACHINE[state]?.isLoad} />
    </>
  );
}
