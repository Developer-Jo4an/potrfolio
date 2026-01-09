import {useRef, useMemo} from "react";
import useLoadScene from "../../../../shared/scene/model/hooks/useLoadScene";
import useStateControls from "../../../../shared/scene/model/hooks/useStateControls";
import Background from "../background/Background";
import Effects from "../effects/Effects";
import Boosters from "../boosters/Boosters";
import useBasketballStore from "../../model/state-manager/basketballStore";
import gsap from "gsap";
import imports from "../../../../shared/scene/lib/import";
import {BASKETBALL_STATE_MACHINE} from "../../constants/stateMachine";
import {mainSceneSettings} from "../../constants/mainSceneSettings";
import {preload} from "../../constants/preload";
import {types} from "../../constants/types";
import {IGNORE_NEXT_STATES, LOSE} from "../../../car-game/constants/stateMachine";
import {BASKETBALL} from "../../constants/game";
import styles from "./BasketballGame.module.scss";

export default function BasketballGame() {
  const {wrapper, setWrapper, setState} = useBasketballStore();
  const containerRef = useRef();

  useLoadScene({
    libraries: [imports.three, imports.rapier3d],
    loadWrapper: () => import("../../controllers/Wrapper"),
    beforeInit(wrapper) {
      gsap.localTimeline.createSpace(BASKETBALL);
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
  }, [wrapper]), setState);

  return (
    <div className={styles.basketballGame}>
      <Background/>
      <div ref={containerRef} className={styles.basketballContainer}/>
      <Effects/>
      <Boosters/>
    </div>
  );
}