import {useRef} from "react";
import useLoadScene from "../../../../shared/scene/model/hooks/useLoadScene";
import useBasketballStore from "../../model/state-manager/basketballStore";
import imports from "../../../../shared/scene/lib/import";
import {types} from "../../../car-game/constants/entities";
import {BASKETBALL_STATE_MACHINE} from "../../constants/stateMachine";
import {mainSceneSettings} from "../../constants/mainSceneSettings";
import {preload} from "../../constants/preload";
import styles from "./BasketballGame.module.scss";

export default function BasketballGame() {
  const {setWrapper, wrapper} = useBasketballStore();
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

  return (
    <div ref={containerRef} className={styles.basketballGame}/>
  );
}