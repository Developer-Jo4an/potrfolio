"use client";
import {useEffect, useMemo, useRef} from "react";
import {useCarStore} from "../../model/state-machine/carStore";
import {types} from "../../constants/entities";
import {mainSceneSettings} from "../../constants/mainSceneSettings";
import {preload} from "../../constants/preload";
import {STATE_MACHINE, IGNORE_NEXT_STATES, LOSE} from "../../constants/stateMachine";
import {BONUSES_COLLISION, BLOCKS_COLLISION} from "../../constants/events";
import {imports, Image, useResetScene, useStateControls, eventSubscription, useLoadScene} from "@shared";
import styles from "./CarGame.module.scss";

export function CarGame() {
  const {setWrapper, wrapper} = useCarStore();
  const containerRef = useRef();

  useLoadScene({
    libraries: [imports.pixi, imports.sat],
    loadWrapper: () => import("../../controllers/Wrapper"),
    beforeInit(wrapper) {
      wrapper.controller.storage.states = STATE_MACHINE;
      wrapper.controller.storage.types = types;
    },
    initProps: {stateMachine: STATE_MACHINE, mainSceneSettings, preload},
    afterInit: setWrapper,
    containerRef,
  });

  useStateControls(
    wrapper,
    STATE_MACHINE,
    IGNORE_NEXT_STATES,
    useMemo(() => {
      if (!wrapper) return {};
      return {
        async [LOSE](promise, toNextState) {
          await promise;
          await wrapper.reset();
          toNextState();
        },
      };
    }, [wrapper]),
  );

  useEffect(() => {
    if (wrapper)
      return eventSubscription({
        target: wrapper.eventBus,
        callbacksBus: [
          {
            event: BONUSES_COLLISION,
            callback: ({count}) => {},
          },
          {
            event: BLOCKS_COLLISION,
            callback: ({count}) => {},
          },
        ],
      });
  }, [wrapper]);

  useResetScene({wrapper});

  return (
    <>
      <Image className={styles.carGameBackground} src={"widgets/car-game/background.jpg"} />
      <div className={styles.carGame} ref={containerRef} />
    </>
  );
}
