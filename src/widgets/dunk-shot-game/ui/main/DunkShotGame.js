"use client";
import {useState} from "react";
import {Boosters} from "../boosters/Boosters";
import {Canvas} from "../canvas/Canvas";
import {Elements} from "../elements/Elements";
import {Progress} from "../progress/Progress";
import {useEndGame} from "../../model/hooks/useEndGame";
import {ComponentTypes, GameWrapper} from "@features/game-wrapper";
import {useDunkShotStore} from "../../model/state-manager/dunkShotStore";
import content from "../../constants/content";
import * as statesData from "../../controllers/constants/stateMachine";

export function DunkShotGame() {
  const {wrapper, gameData, gameData: {state} = {}} = useDunkShotStore();
  const [fullProps, setFullProps] = useState({});

  const onEnd = useEndGame();

  const totalProps = {
    ...fullProps,
    wrapper,
    state,
    content,
    gameSpace: {gameData},
    onEnd,
    isPending: !state || (statesData.STATE_MACHINE[state]?.isLoad ?? false),
    statesData,
  };

  return (
    <GameWrapper
      fullProps={totalProps}
      setFullProps={setFullProps}
      list={[
        {type: ComponentTypes.BACKGROUND},
        {Component: Canvas},
        {type: ComponentTypes.TOP_MENU},
        {Component: Progress},
        {Component: Boosters},
        {Component: Elements},
        {type: ComponentTypes.LOADER},
      ]}
    />
  );
}
