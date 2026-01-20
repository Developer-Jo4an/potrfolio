import {useRef} from "react";
import {useLoadDunkShotScene} from "../../model/hooks/useLoadDunkShotScene";
import {DunkShotWalls} from "../walls/DunkShotWalls";
import {DunkShotGameElements} from "../game-elements/DunkShotGameElements";
import {ProgressBar} from "@features/progress-bar";
import {Loader} from "@shared";
import {DunkShotBoosters} from "../boosters/DunkShotBoosters";
import {useDunkShotStore} from "../../model/state-manager/dunkShotStore";
import {DUNK_SHOT_STATE_MACHINE} from "../../constants/stateMachine";
import {TopMenu} from "../../../../features/top-menu";
import styles from "./DunkShotGame.module.scss";

export function DunkShotGame() {
  const {gameData: {state, lifes, score, progress: {min, current, max} = {}} = {}} = useDunkShotStore();
  const {containerRef, isCanPressPause, onPause} = useLoadDunkShotScene();
  const topMenuEls = useRef();
  const progressBarEls = useRef();

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
      <DunkShotWalls containerRef={containerRef} />
      <DunkShotGameElements topMenuEls={topMenuEls} progressBarEls={progressBarEls} />
      <Loader isPending={!state || DUNK_SHOT_STATE_MACHINE[state]?.isLoad} />
    </>
  );
}
