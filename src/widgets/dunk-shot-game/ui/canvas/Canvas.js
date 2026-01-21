import {useRef} from "react";
import {useBeforeInit} from "../../model/hooks/useBeforeInit";
import {useStats} from "../../model/hooks/useStats";
import {useProgressHandler} from "../../model/hooks/useProgressHandler";
import {useDunkShotStore} from "../../model/state-manager/dunkShotStore";
import {imports, useLoadScene, useResetScene, useStateControls} from "@shared";
import {DUNK_SHOT_STATE_MACHINE, IGNORE_NEXT_STATES} from "../../constants/stateMachine";
import {mainSceneSettings} from "../../config/mainSceneSettings";
import {preload} from "../../config/preload";
import styles from "./Canvas.module.scss";

export function Canvas() {
  const {wrapper, reset, setState, setWrapper} = useDunkShotStore();
  const containerRef = useRef();

  useLoadScene({
    libraries: [imports.pixi, imports.matter],
    loadWrapper: () => import("../../controllers/Wrapper"),
    beforeInit: useBeforeInit(),
    initProps: {stateMachine: DUNK_SHOT_STATE_MACHINE, mainSceneSettings, preload},
    afterInit: setWrapper,
    containerRef,
  });
  useStateControls(wrapper, DUNK_SHOT_STATE_MACHINE, IGNORE_NEXT_STATES, null, setState);
  useStats();
  useProgressHandler();

  useResetScene({wrapper, extraCallback: reset});

  return <div ref={containerRef} className={styles.dunkShotGame} />;
}
