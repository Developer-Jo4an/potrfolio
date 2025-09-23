import {useLoadDunkShotScene} from "../../model/hooks/useLoadDunkShotScene";
import DunkShotWalls from "../walls/DunkShotWalls";
import styles from "./DunkShotGame.module.scss";

export default function DunkShotGame() {
  const containerRef = useLoadDunkShotScene();

  return (
    <>
      <div ref={containerRef} className={styles.dunkShotContainer}/>
      <DunkShotWalls containerRef={containerRef}/>
    </>
  );
}