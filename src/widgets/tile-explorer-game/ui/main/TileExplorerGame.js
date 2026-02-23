"use client";
import {useState} from "react";
import {useEndGame} from "../../model/hooks/useEndGame";
import {Canvas} from "../canvas/Canvas";
import {Boosters} from "../boosters/Boosters";
import {ProxyGameSpaceStore, useGameSpaceStore} from "@shared";
import * as statesData from "../../controllers/constants/stateMachine";
import {ComponentTypes, GameWrapper} from "@features/game-wrapper";
import {gameSpace as gameSpaceConfig} from "../../controllers/constants/gameSpace";
import {useTileExplorerStore} from "../../model/state-manager/tileExplorerStore";
import content from "../../constants/content";

export function TileExplorerGame() {
  const {wrapper, state} = useTileExplorerStore();
  const [fullProps, setFullProps] = useState({});
  const gameSpace = useGameSpaceStore(ProxyGameSpaceStore.get("tileExplorer"), gameSpaceConfig);
  const onEnd = useEndGame({gameSpace});

  const totalProps = {
    ...fullProps,
    wrapper,
    content,
    gameSpace: {gameData: {...gameSpace, score: gameSpace?.score, lifes: gameSpace?.currentTime}},
    state,
    onEnd,
    isPending: !state || (statesData.STATE_MACHINE[state]?.isLoad ?? false),
    statesData
  };

  return (
    <GameWrapper
      fullProps={totalProps}
      setFullProps={setFullProps}
      list={[
        {type: ComponentTypes.BACKGROUND},
        {Component: Canvas},
        {type: ComponentTypes.TOP_MENU},
        {Component: Boosters},
        {type: ComponentTypes.LOADER}
      ]}
    />
  );
}