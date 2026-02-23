"use client";
import {useState} from "react";
import {useEndGame} from "../../model/hooks/useEndGame";
import {Canvas} from "../canvas/Canvas";
import * as statesData from "../../controllers/constants/stateMachine";
import {ProxyGameSpaceStore, useGameSpaceStore} from "@shared";
import {ComponentTypes, GameWrapper} from "@features/game-wrapper";
import {useCarStore} from "../../model/state-machine/carStore";
import {gameSpace as gameSpaceConfig} from "../../controllers/constants/gameSpace";
import content from "../../constants/content";

export function CarGame() {
  const {wrapper, state} = useCarStore();
  const [fullProps, setFullProps] = useState({});
  const gameSpace = useGameSpaceStore(ProxyGameSpaceStore.get("car"), gameSpaceConfig);

  const onEnd = useEndGame({gameSpace});

  const totalProps = {
    ...fullProps, wrapper, state, content, gameSpace: {gameData: gameSpace}, onEnd,
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
