import {useRef} from "react";
import {useLoadScene, useStateController, imports} from "@shared";
import {useDunkShotStats} from "./useDunkShotStats";
import {useBeforeInit} from "./useBeforeInit";
import {useDunkShotProgressHandler} from "./useDunkShotProgressHandler";
import {useResetGame} from "./useDestroyGame";
import {useDunkShotPause} from "./useDunkShotPause";
import {useDunkShotStore} from "../state-manager/dunkShotStore";
import {DUNK_SHOT_STATE_MACHINE, IGNORE_NEXT_STATES} from "../../constants/stateMachine";
import {mainSceneSettings} from "../../config/mainSceneSettings";
import {preload} from "../../config/preload";

export function useLoadDunkShotScene() {
  const {wrapper, reset, setWrapper} = useDunkShotStore();
  const containerRef = useRef();

  const {onPause, isCanPressPause} = useDunkShotPause();
  useLoadScene({
    libraries: [imports.pixi, imports.matter],
    loadWrapper: () => import("../../controllers/Wrapper"),
    beforeInit: useBeforeInit(),
    initProps: {stateMachine: DUNK_SHOT_STATE_MACHINE, mainSceneSettings, preload},
    afterInit: setWrapper,
    containerRef,
  });
  useStateController(wrapper, IGNORE_NEXT_STATES, DUNK_SHOT_STATE_MACHINE);
  useDunkShotStats();
  useDunkShotProgressHandler();
  useResetGame({wrapper, callback: reset});

  return {containerRef, isCanPressPause, onPause};
}
