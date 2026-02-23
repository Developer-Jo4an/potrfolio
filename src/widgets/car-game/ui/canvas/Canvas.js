import {useRef} from "react";
import cl from "classnames";
import {imports, useLoadScene, useResetScene, useStateControls} from "@shared";
import {useCarStore} from "../../model/state-machine/carStore";
import {IGNORE_NEXT_STATES, LOSE, STATE_MACHINE, WIN} from "../../controllers/constants/stateMachine";
import {types} from "../../controllers/constants/entities";
import {mainSceneSettings} from "../../controllers/constants/mainSceneSettings";
import {preload} from "../../controllers/constants/preload";
import styles from "./Canvas.module.scss";

export function Canvas() {
  const {wrapper, setWrapper, state, setState} = useCarStore();
  const containerRef = useRef();

  useLoadScene({
    libraries: [imports.pixi, imports.sat],
    loadWrapper: () => import("../../controllers/Wrapper"),
    beforeInit(wrapper) {
      wrapper.controller.storage.states = STATE_MACHINE;
      wrapper.controller.storage.types = types;
    },
    initProps: {stateMachine: STATE_MACHINE, mainSceneSettings, preload},
    afterInit: setWrapper,
    containerRef
  });

  useStateControls(wrapper, STATE_MACHINE, IGNORE_NEXT_STATES, null, setState);

  useResetScene({wrapper});

  const isGameEnd = [WIN, LOSE].includes(state);

  return <div ref={containerRef} className={cl(styles.canvas, {[styles.canvasDisabled]: isGameEnd})}/>;
}