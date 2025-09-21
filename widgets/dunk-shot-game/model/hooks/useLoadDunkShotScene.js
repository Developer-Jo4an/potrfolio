import useLoadScene from "../../../../shared/scene/model/hooks/useLoadScene";
import {useEffect, useRef, useState} from "react";
import {getDefaultState} from "../../../../shared/scene/lib/state/getDefaultState";
import {eventSubscription} from "../../../../shared/lib/events/eventListener";
import {mainSceneSettings} from "../../constants/mainSceneSettings";
import {preload} from "../../constants/preload";
import {DUNK_SHOT_STATE_MACHINE, IGNORE_NEXT_STATES} from "../../constants/stateMachine";
import imports from "../../../../shared/scene/lib/import";
import {STATE_CHANGED} from "../../../../shared/scene/constants/events/names";
import {DUNK_SHOT_TWEEN} from "../../constants/constants";
import gsap from "gsap";

export const useLoadDunkShotScene = () => {
  const containerRef = useRef();
  const [wrapper, setWrapper] = useState();

  useLoadScene({
    libraries: [imports.pixi, imports.pixiLayers, imports.matter],
    loadWrapper: () => import("../../controllers/Wrapper"),
    beforeInit: () => gsap.localTimeline.createSpace(DUNK_SHOT_TWEEN),
    initProps: {containerRef, stateMachine: DUNK_SHOT_STATE_MACHINE, mainSceneSettings, preload},
    afterInit: wrapper => setWrapper(wrapper)
  });

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus, controller} = wrapper;

    const clear = eventSubscription({
      target: eventBus,
      callbacksBus: [{
        event: STATE_CHANGED, async callback({state}) {
          await controller[`${state}Select`]?.();
          if (!IGNORE_NEXT_STATES.includes(state))
            controller.state = DUNK_SHOT_STATE_MACHINE[state].nextState;
        }
      }]
    });

    controller.state = getDefaultState(DUNK_SHOT_STATE_MACHINE);

    return clear;
  }, [wrapper]);

  return containerRef;
};