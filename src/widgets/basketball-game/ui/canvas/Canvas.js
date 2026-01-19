import {useRef} from "react";
import {useLoadScene, useStateControls, useResetScene, imports} from "@shared";
import cl from "classnames";
import {useBasketballStore} from "../../model/state-manager/basketballStore";
import {BASKETBALL_STATE_MACHINE, IGNORE_NEXT_STATES, WIN, LOSE} from "../../constants/stateMachine";
import {types} from "../../constants/types";
import {mainSceneSettings} from "../../constants/mainSceneSettings";
import {preload} from "../../constants/preload";
import styles from "./Canvas.module.scss";

export function Canvas() {
  const {wrapper, setWrapper, state, setState} = useBasketballStore();
  const containerRef = useRef();

  useLoadScene({
    libraries: [imports.three, imports.rapier3d, imports.quarks],
    loadWrapper: () => import("../../controllers/Wrapper"),
    beforeInit(wrapper) {
      wrapper.controller.storage.states = BASKETBALL_STATE_MACHINE;
      wrapper.controller.storage.types = types;
    },
    initProps: {stateMachine: BASKETBALL_STATE_MACHINE, mainSceneSettings, preload},
    afterInit: setWrapper,
    containerRef
  });

  useStateControls(
    wrapper,
    BASKETBALL_STATE_MACHINE,
    IGNORE_NEXT_STATES,
    useRef({}).current,
    setState
  );

  useResetScene({wrapper});

  const isGameEnd = [WIN, LOSE].includes(state);

  return (
    <div ref={containerRef} className={cl(styles.canvas, {[styles.canvasDisabled]: isGameEnd})}/>
  );
}