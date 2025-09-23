import {useRef} from "react";
import useLoadScene from "../../../../shared/scene/model/hooks/useLoadScene";
import useStateController from "../../../../shared/scene/model/hooks/useStateController";
import useDunkShotStore from "../state-manager/dunkShotStore";
import {mainSceneSettings} from "../../constants/mainSceneSettings";
import {preload} from "../../constants/preload";
import {DUNK_SHOT_STATE_MACHINE, IGNORE_NEXT_STATES} from "../../constants/stateMachine";
import imports from "../../../../shared/scene/lib/import";
import {DUNK_SHOT_TWEEN} from "../../constants/constants";
import {DUNK_SHOT_CONFIG_EVENT, DUNK_SHOT_GAME_DATA_EVENT} from "../../constants/events";
import gsap from "gsap";

export const useLoadDunkShotScene = () => {
  const {wrapper, getGameConfig, setWrapper} = useDunkShotStore();
  const containerRef = useRef();

  useLoadScene({
    libraries: [imports.pixi, imports.matter],
    loadWrapper: () => import("../../controllers/Wrapper"),
    async beforeInit(wrapper) {
      gsap.localTimeline.createSpace(DUNK_SHOT_TWEEN);

      const {eventBus} = wrapper;

      const unsubscriptionForGameData = useDunkShotStore.subscribe(
        state => state.gameData,
        gameData => eventBus.dispatchEvent({type: DUNK_SHOT_GAME_DATA_EVENT, gameData})
      );

      const unsubscriptionForConfig = useDunkShotStore.subscribe(
        state => state.config,
        config => eventBus.dispatchEvent({type: DUNK_SHOT_CONFIG_EVENT, config})
      );

      await getGameConfig();

      return () => {
        unsubscriptionForGameData();
        unsubscriptionForConfig();
      };
    },
    initProps: {containerRef, stateMachine: DUNK_SHOT_STATE_MACHINE, mainSceneSettings, preload},
    afterInit: wrapper => setWrapper(wrapper)
  });

  useStateController(wrapper, IGNORE_NEXT_STATES, DUNK_SHOT_STATE_MACHINE);

  return containerRef;
};