import {useRef} from "react";
import cl from "classnames";
import {imports, ProxyGameSpaceStore, useLoadScene, useResetScene, useStateControls} from "@shared";
import {IGNORE_NEXT_STATES, STATE_MACHINE} from "../../controllers/constants/stateMachine";
import {types} from "../../controllers/types";
import {mainSceneSettings} from "../../controllers/constants/mainSceneSettings";
import {preload} from "../../controllers/constants/preload";
import {LOSE, WIN} from "../../controllers/constants/stateMachine";
import {useDoodleJumpStore} from "../../model/state-manager/doodleJumpStore";
import styles from "./Canvas.module.scss";

export function Canvas() {
  const {wrapper, state, setWrapper, setState} = useDoodleJumpStore();
  const containerRef = useRef();

  useLoadScene({
    libraries: [imports.pixi, imports.sat],
    loadWrapper: () => import("../../controllers/Wrapper"),
    beforeInit(wrapper) {
      wrapper.controller.storage.states = STATE_MACHINE;
      wrapper.controller.storage.types = types;

      const gameStore = ProxyGameSpaceStore.get("doodleJump");
      wrapper.controller.storage.gameStore = gameStore;
      wrapper.controller.storage.gameSpace = gameStore.gameSpace;
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
