"use client";
import {useMemo} from "react";
import {useEndGame} from "../../model/hooks/useEndGame";
import {Canvas} from "../canvas/Canvas";
import {Background} from "../background/Background";
import {TopMenu} from "@entities/top-menu";
import {Boosters} from "../boosters/Boosters";
import {Loader, ProxyGameSpaceStore, useGameSpaceStore} from "@shared";
import {usePause} from "../../model/hooks/usePause";
import {gameSpace as gameSpaceConfig} from "../../constants/gameSpace";
import {useTileExplorerStore} from "../../model/state-manager/tileExplorerStore";
import {INITIALIZATION, INITIALIZATION_LEVEL, APPLY} from "../../constants/stateMachine";
import content from "../../constants/content";
import styles from "./TileExplorerGame.module.scss";

const {menu: {lifes, score, sound}} = content;

export function TileExplorerGame() {
  const {state} = useTileExplorerStore();
  const pause = usePause();

  const gameSpace = useGameSpaceStore(ProxyGameSpaceStore.get("tileExplorer"), gameSpaceConfig);

  const fullProps = useMemo(
    () => ({
      gameSpace,
      isPending: !state || [INITIALIZATION_LEVEL, APPLY, INITIALIZATION].includes(state)
    }),
    [gameSpace, state]
  );

  useEndGame(fullProps);

  return (
    <div className={styles.tileExplorerGame}>
      <Background {...fullProps}/>
      <Canvas {...fullProps}/>
      <TopMenu
        lifes={{count: gameSpace?.currentTime, ...lifes}}
        score={{count: gameSpace?.score, ...score}}
        sound={sound}
        pause={pause}
      />
      <Boosters {...fullProps} />
      <Loader isPending={fullProps.isPending}/>
    </div>
  );
}