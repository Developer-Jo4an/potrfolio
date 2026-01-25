"use client";
import styles from "./TileExplorerGame.module.scss";
import {Canvas} from "../canvas/Canvas";

export function TileExplorerGame() {
  return (
    <div className={styles.tileExplorerGame}>
      <Canvas />
    </div>
  );
}
