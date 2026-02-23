import {useRef} from "react";
import {useLoadScene, useStateControls, useResetScene, imports} from "@shared";
import cl from "classnames";
import {useBasketballStore} from "../../model/state-manager/basketballStore";
import {STATE_MACHINE, IGNORE_NEXT_STATES, WIN, LOSE} from "../../controllers/constants/stateMachine";
import {types} from "../../controllers/constants/types";
import {mainSceneSettings} from "../../controllers/constants/mainSceneSettings";
import {preload} from "../../controllers/constants/preload";
import styles from "./Canvas.module.scss";

export function Canvas() {
  const {wrapper, setWrapper, state, setState} = useBasketballStore();
  const containerRef = useRef();

  useLoadScene({
    libraries: [imports.three, imports.rapier3d, imports.quarks],
    loadWrapper: () => import("../../controllers/Wrapper"),
    beforeInit(wrapper) {
      wrapper.controller.storage.states = STATE_MACHINE;
      wrapper.controller.storage.types = types;
    },
    initProps: {stateMachine: STATE_MACHINE, mainSceneSettings, preload},
    afterInit: setWrapper,
    containerRef,
  });

  useStateControls(wrapper, STATE_MACHINE, IGNORE_NEXT_STATES, null, setState);

  useResetScene({wrapper});

  const isGameEnd = [WIN, LOSE].includes(state);

  return <div ref={containerRef} className={cl(styles.canvas, {[styles.canvasDisabled]: isGameEnd})} />;
}
