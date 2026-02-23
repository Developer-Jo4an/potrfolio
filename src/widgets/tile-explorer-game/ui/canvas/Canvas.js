import {useRef} from "react";
import cl from "classnames";
import {imports, ProxyGameSpaceStore, useLoadScene, useResetScene, useStateControls} from "@shared";
import {useTileExplorerStore} from "../../model/state-manager/tileExplorerStore";
import {IGNORE_NEXT_STATES, STATE_MACHINE} from "../../controllers/constants/stateMachine";
import {types} from "../../controllers/entities/types";
import {MAIN_SCENE_SETTINGS} from "../../controllers/constants/mainSceneSettings";
import {preload} from "../../controllers/constants/preload";
import {LOSE, WIN} from "../../controllers/constants/stateMachine";
import {config} from "../../config/config";
import styles from "./Canvas.module.scss";

export function Canvas() {
  const {wrapper, state, setWrapper, setState} = useTileExplorerStore();
  const containerRef = useRef();

  useLoadScene({
    libraries: [imports.pixi],
    loadWrapper: () => import("../../controllers/Wrapper"),
    beforeInit(wrapper) {
      wrapper.controller.storage.states = STATE_MACHINE;
      wrapper.controller.storage.types = types;

      const gameStore = ProxyGameSpaceStore.get("tileExplorer");
      wrapper.controller.storage.gameStore = gameStore;
      wrapper.controller.storage.gameSpace = gameStore.gameSpace;

      wrapper.controller.storage.config = config;
    },
    initProps: {stateMachine: STATE_MACHINE, mainSceneSettings: MAIN_SCENE_SETTINGS, preload},
    afterInit: setWrapper,
    containerRef
  });

  useStateControls(wrapper, STATE_MACHINE, IGNORE_NEXT_STATES, null, setState);

  useResetScene({wrapper});

  const isGameEnd = [WIN, LOSE].includes(state);

  return <div ref={containerRef} className={cl(styles.canvas, {[styles.canvasDisabled]: isGameEnd})}/>;
}
