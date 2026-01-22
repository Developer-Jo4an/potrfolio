import {useEffect} from "react";
import {useAppCallbacks, eventSubscription, STATE_CHANGED, useModalProvider} from "@shared";
import {useDunkShotStore} from "../state-manager/dunkShotStore";
import {LOSE, WIN} from "../../constants/stateMachine";
import content from "../../constants/content";

const {endModal} = content;

export function useEndGame() {
  const {wrapper} = useDunkShotStore();
  const {redirect} = useAppCallbacks();
  const {names, add} = useModalProvider();

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

            const modalData = endModal({wrapper, modalNames: names, redirect, score, pureCount, status: state, story});
            add(modalData);
          },
        },
      ],
    });
  }, [wrapper]);
}
