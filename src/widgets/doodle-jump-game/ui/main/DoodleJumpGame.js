"use client";
import {useState} from "react";
import {useEndGame} from "../../model/hooks/useEndGame";
import {useGameSpaceStore, ProxyGameSpaceStore} from "@shared";
import {Canvas} from "../canvas/Canvas";
import * as statesData from "../../controllers/constants/stateMachine";
import {gameSpace as gameSpaceConfig} from "../../controllers/constants/gameSpace";
import {ComponentTypes, GameWrapper} from "@features/game-wrapper";
import {useDoodleJumpStore} from "../../model/state-manager/doodleJumpStore";
import content from "../../constants/content";

export function DoodleJumpGame() {
  const {wrapper, state} = useDoodleJumpStore();
  const [fullProps, setFullProps] = useState({});
  const gameSpace = useGameSpaceStore(ProxyGameSpaceStore.get("doodleJump"), gameSpaceConfig);

  const onEnd = useEndGame({gameSpace});

  const totalProps = {
    ...fullProps,
    wrapper,
    content,
    gameSpace: {gameData: {...gameSpace, score: gameSpace?.score, lifes: gameSpace?.lifes}},
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
        {type: ComponentTypes.LOADER}
      ]}
    />
  );
}
