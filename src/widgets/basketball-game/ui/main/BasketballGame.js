"use client";
import {useMemo, useRef} from "react";
import {Loader, useGameSpaceStore} from "@shared";
import {Canvas} from "../canvas/Canvas";
import {Background} from "../background/Background";
import {Effects} from "../effects/Effects";
import {Boosters} from "../boosters/Boosters";
import {usePause} from "../../model/hooks/usePause";
import {useGetInfo} from "../../model/hooks/useGetInfo";
import {useEndGame} from "../../model/hooks/useEndGame";
import {TopMenu} from "@features/top-menu";
import {useBasketballStore} from "../../model/state-manager/basketballStore";
import {INITIALIZATION, INITIALIZATION_LEVEL} from "../../constants/stateMachine";
import {gameSpaceStore} from "../../model/storages/gameSpace";
import content from "../../constants/content";
import styles from "./BasketballGame.module.scss";

const {
  menu: {score, lifes, sound},
} = content;

export function BasketballGame() {
  const {state} = useBasketballStore();
  const gameSpace = useGameSpaceStore(gameSpaceStore);
  const pause = usePause();
  const topMenuElementsRef = useRef();
  const boostersRef = useRef();
  const effectFreeSpaceRef = useRef();

  const fullProps = useMemo(
    () => ({
      effectFreeSpaceRef,
      gameSpace,
      boostersRef,
      topMenuElementsRef,
      isPending: !state || [INITIALIZATION_LEVEL, INITIALIZATION].includes(state),
    }),
    [gameSpace, state],
  );

  useGetInfo(fullProps);
  useEndGame();

  return (
    <div className={styles.basketballGame}>
      <Background {...fullProps} />
      <Canvas {...fullProps} />
      <TopMenu
        ref={topMenuElementsRef}
        lifes={{count: gameSpace.gameData.lifes, ...lifes}}
        score={{count: gameSpace.gameData.score, ...score}}
        sound={sound}
        pause={pause}
      />
      <Boosters {...fullProps} ref={fullProps.boostersRef} />
      <Effects {...fullProps} ref={fullProps.effectFreeSpaceRef} />
      <Loader isPending={fullProps.isPending} />
    </div>
  );
}
