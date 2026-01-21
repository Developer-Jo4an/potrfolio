import {useAppCallbacks} from "@application/providers/callbacks";
import {useEffect} from "react";
import {eventSubscription, STATE_CHANGED} from "@shared";
import {useModalStore} from "@application/providers/modal";
import {useDunkShotStore} from "../state-manager/dunkShotStore";
import {LOSE, WIN} from "../../constants/stateMachine";
import content from "../../constants/content";

const {endModal} = content;

export function useEndGame() {
  const {wrapper} = useDunkShotStore();
  const {add} = useModalStore();
  const {redirect} = useAppCallbacks();

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: STATE_CHANGED,
          callback({state}) {
            if (![LOSE, WIN].includes(state)) return;

            const {
              gameData: {story, pureCount, score},
            } = useDunkShotStore.getState();

            const modalData = endModal({wrapper, redirect, score, pureCount, status: state, story});
            add(modalData);
          },
        },
      ],
    });
  }, [wrapper]);
}
