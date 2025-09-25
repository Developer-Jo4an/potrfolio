import {useRef} from "react";
import useLoadScene from "../../../../shared/scene/model/hooks/useLoadScene";
import useStateController from "../../../../shared/scene/model/hooks/useStateController";
import useDunkShotStats from "./useDunkShotStats";
import useBeforeInit from "./useBeforeInit";
import useDunkShotProgressHandler from "./useDunkShotProgressHandler";
import useResetGame from "./useDestroyGame";
import useDunkShotStore from "../state-manager/dunkShotStore";
import {DUNK_SHOT_STATE_MACHINE, IGNORE_NEXT_STATES} from "../../constants/stateMachine";
import imports from "../../../../shared/scene/lib/import";
import {mainSceneSettings} from "../../config/mainSceneSettings";
import {preload} from "../../config/preload";

export default function useLoadDunkShotScene() {
  const {wrapper, setWrapper} = useDunkShotStore();
  const containerRef = useRef();

  useLoadScene({
    libraries: [imports.pixi, imports.matter],
    loadWrapper: () => import("../../controllers/Wrapper"),
    beforeInit: useBeforeInit(),
    initProps: {containerRef, stateMachine: DUNK_SHOT_STATE_MACHINE, mainSceneSettings, preload},
    afterInit: wrapper => setWrapper(wrapper)
  });
  useStateController(wrapper, IGNORE_NEXT_STATES, DUNK_SHOT_STATE_MACHINE);
  useDunkShotStats();
  useDunkShotProgressHandler();
  useResetGame({wrapper});

  return containerRef;
};