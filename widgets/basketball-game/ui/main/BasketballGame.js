import {useRef, useMemo} from "react";
import useLoadScene from "../../../../shared/scene/model/hooks/useLoadScene";
import useStateControls from "../../../../shared/scene/model/hooks/useStateControls";
import useBasketballStore from "../../model/state-manager/basketballStore";
import imports from "../../../../shared/scene/lib/import";
import {BASKETBALL_STATE_MACHINE} from "../../constants/stateMachine";
import {mainSceneSettings} from "../../constants/mainSceneSettings";
import {preload} from "../../constants/preload";
import {types} from "../../constants/types";
import {IGNORE_NEXT_STATES, LOSE} from "../../../car-game/constants/stateMachine";
import styles from "./BasketballGame.module.scss";

export default function BasketballGame() {
  const {wrapper, setWrapper} = useBasketballStore();
  const containerRef = useRef();

  useLoadScene({
    libraries: [imports.three],
    loadWrapper: () => import("../../controllers/Wrapper"),
    beforeInit(wrapper) {
      wrapper.controller.storage.states = BASKETBALL_STATE_MACHINE;
      wrapper.controller.storage.types = types;
    },
    initProps: {stateMachine: BASKETBALL_STATE_MACHINE, mainSceneSettings, preload},
    afterInit: setWrapper,
    containerRef
  });

  useStateControls(wrapper, BASKETBALL_STATE_MACHINE, IGNORE_NEXT_STATES, useMemo(() => {
    if (!wrapper) return {};
    return {
      async [LOSE](promise, toNextState) {
        await promise;
        await wrapper.reset();
        toNextState();
      }
    };
  }, [wrapper]));

  return (
    <div ref={containerRef} className={styles.basketballGame}/>
  );
}