import {useLoadDunkShotScene} from "../../model/hooks/useLoadDunkShotScene";
import {TopMenu} from "../../../../features/top-menu";
import {useRef} from "react";
import DunkShotWalls from "../walls/DunkShotWalls";
import DunkShotGameElements from "../game-elements/DunkShotGameElements";
import styles from "./DunkShotGame.module.scss";
import useDunkShotStore from "../../model/state-manager/dunkShotStore";

export default function DunkShotGame() {
  const {gameData: {lifes, score}} = useDunkShotStore();
  const containerRef = useLoadDunkShotScene();

  const topMenuEls = useRef();

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
      <DunkShotGameElements topMenuEls={topMenuEls}/>
    </>
  );
}