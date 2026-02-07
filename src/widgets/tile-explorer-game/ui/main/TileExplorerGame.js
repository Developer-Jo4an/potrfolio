"use client";
import {Canvas} from "../canvas/Canvas";
import {ProxyGameSpaceStore, useGameSpaceStore} from "@shared";
import {gameSpace as gameSpaceConfig} from "../../constants/gameSpace";
import styles from "./TileExplorerGame.module.scss";
import content from "../../constants/content";
import {useTileExplorerStore} from "../../model/state-manager/tileExplorerStore";
import {PLAYING} from "../../constants/stateMachine";

export function TileExplorerGame() {
  const {state, wrapper} = useTileExplorerStore();

  const gameSpace = useGameSpaceStore(ProxyGameSpaceStore.get("tileExplorer"), gameSpaceConfig);

  const onClick = (type) => {
    state === PLAYING && wrapper.applyBooster(type);
  };

  return (
    <div className={styles.tileExplorerGame}>
      <Canvas/>
      <div className={styles.boosters}>
        {content.boosters.map(({type}, i) => (
          <button key={i} className={styles.booster} onClick={() => onClick(type)}>
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}