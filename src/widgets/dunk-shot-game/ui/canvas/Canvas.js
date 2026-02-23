import {useRef} from "react";
import {useBeforeInit} from "../../model/hooks/useBeforeInit";
import {useStats} from "../../model/hooks/useStats";
import {useProgressHandler} from "../../model/hooks/useProgressHandler";
import {useDunkShotStore} from "../../model/state-manager/dunkShotStore";
import {imports, useLoadScene, useResetScene, useStateControls} from "@shared";
import {STATE_MACHINE, IGNORE_NEXT_STATES} from "../../controllers/constants/stateMachine";
import {mainSceneSettings} from "../../controllers/constants/mainSceneSettings";
import {preload} from "../../controllers/constants/preload";
import styles from "./Canvas.module.scss";

export function Canvas() {
  const {wrapper, reset, setState, setWrapper} = useDunkShotStore();
  const containerRef = useRef();

  useLoadScene({
    libraries: [imports.pixi, imports.matter],
    loadWrapper: () => import("../../controllers/Wrapper"),
    beforeInit: useBeforeInit(),
    initProps: {stateMachine: STATE_MACHINE, mainSceneSettings, preload},
    afterInit: setWrapper,
    containerRef,
  });
  useStateControls(wrapper, STATE_MACHINE, IGNORE_NEXT_STATES, null, setState);
  useStats();
  useProgressHandler();

  useResetScene({wrapper, extraCallback: reset});

  return <div ref={containerRef} className={styles.dunkShotGame} />;
}
