"use client";
import {Canvas} from "../canvas/Canvas";
import {ProxyGameSpaceStore, useGameSpaceStore} from "@shared";
import {gameSpace as gameSpaceConfig} from "../../constants/gameSpace";
import styles from "./TileExplorerGame.module.scss";

export function TileExplorerGame() {
  const gameSpace = useGameSpaceStore(ProxyGameSpaceStore.get("tileExplorer"), gameSpaceConfig);

  return (
    <div className={styles.tileExplorerGame}>
      <Canvas/>
    </div>
  );
}