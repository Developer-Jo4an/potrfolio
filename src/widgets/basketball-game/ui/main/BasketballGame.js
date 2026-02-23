"use client";
import {useState} from "react";
import {useGameSpaceStore} from "@shared";
import {Canvas} from "../canvas/Canvas";
import {Effects} from "../effects/Effects";
import {Boosters} from "../boosters/Boosters";
import {useEndGame} from "../../model/hooks/useEndGame";
import {ComponentTypes, GameWrapper} from "@features/game-wrapper";
import {useBasketballStore} from "../../model/state-manager/basketballStore";
import {gameSpaceStore} from "../../model/storages/gameSpace";
import content from "../../constants/content";
import * as statesData from "../../controllers/constants/stateMachine";

export function BasketballGame() {
  const {wrapper, state} = useBasketballStore();
  const [fullProps, setFullProps] = useState({});
  const gameSpace = useGameSpaceStore(gameSpaceStore);

  const onEnd = useEndGame();

  const totalProps = {
    ...fullProps, wrapper, content, state, gameSpace, onEnd,
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
        {Component: Effects},
        {type: ComponentTypes.LOADER}
      ]}
    />
  );
}