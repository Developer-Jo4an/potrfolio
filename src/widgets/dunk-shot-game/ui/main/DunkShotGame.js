"use client";
import {useMemo, useRef} from "react";
import {Background} from "../background/Background";
import {Loader} from "@shared";
import {TopMenu} from "@features/top-menu";
import {Boosters} from "../boosters/Boosters";
import {Canvas} from "../canvas/Canvas";
import {usePause} from "../../model/hooks/usePause";
import {Elements} from "../elements/Elements";
import {Progress} from "../progress/Progress";
import {useEndGame} from "../../model/hooks/useEndGame";
import {useDunkShotStore} from "../../model/state-manager/dunkShotStore";
import {DUNK_SHOT_STATE_MACHINE} from "../../constants/stateMachine";
import content from "../../constants/content";
import styles from "./DunkShotGame.module.scss";

const {
  menu: {lifes: lifesContent, score: scoreContent, sound}
} = content;

export function DunkShotGame() {
  const {gameData: {state, lifes, score} = {}} = useDunkShotStore();
  const topMenuElementsRef = useRef();
  const progressBarEls = useRef();
  const pause = usePause();

  const fullProps = useMemo(() => ({
    progressBarEls,
    topMenuElementsRef,
    isPending: !state || DUNK_SHOT_STATE_MACHINE[state]?.isLoad
  }), [state]);

  useEndGame();

  return (
    <div className={styles.dunkShotGame}>
      <Background/>
      <Canvas/>
      <TopMenu
        ref={topMenuElementsRef}
        lifes={{count: lifes, ...lifesContent}}
        score={{count: score, ...scoreContent}}
        pause={pause}
        sound={sound}
      />
      <Progress {...fullProps} />
      <Boosters {...fullProps} />
      <Elements {...fullProps} />
      <Loader {...fullProps} />
    </div>
  );
}
