import styles from "./DunkShotGame.module.scss";
import {useLoadDunkShotScene} from "../../model/hooks/useLoadDunkShotScene";

export default function DunkShotGame() {
  const containerRef = useLoadDunkShotScene();

  return <div ref={containerRef} className={styles.dunkShotContainer}/>;
}