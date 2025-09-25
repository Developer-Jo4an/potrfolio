import {useRef} from "react";
import {TopMenu} from "../../../../features/top-menu";
import useLoadDunkShotScene from "../../model/hooks/useLoadDunkShotScene";
import DunkShotWalls from "../walls/DunkShotWalls";
import DunkShotGameElements from "../game-elements/DunkShotGameElements";
import ProgressBar from "../../../../features/progress-bar/ui/main/ProgressBar";
import useDunkShotStore from "../../model/state-manager/dunkShotStore";
import styles from "./DunkShotGame.module.scss";

export default function DunkShotGame() {
  const {gameData: {lifes, score, progress: {min, current, max} = {}} = {}} = useDunkShotStore();
  const containerRef = useLoadDunkShotScene();
  const topMenuEls = useRef();
  const progressBarEls = useRef();

  return (
    <>
      <div ref={containerRef} className={styles.dunkShotContainer}/>
      <TopMenu
        className={styles.topMenu}
        ref={topMenuEls}
        lifes={{count: lifes}}
        pause={true}
        sound={true}
        score={{count: score}}
      />
      <DunkShotWalls containerRef={containerRef}/>
      <ProgressBar count={current} progress={current / (max - min)} ref={progressBarEls}/>
      <DunkShotGameElements topMenuEls={topMenuEls} progressBarEls={progressBarEls}/>
    </>
  );
}