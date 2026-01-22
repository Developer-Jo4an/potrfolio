import {useEffect} from "react";
import {eventSubscription, useAppCallbacks, useModalProvider} from "@shared";
import {useBasketballStore} from "../state-manager/basketballStore";
import {LOSE, WIN} from "../../constants/events";
import {gameSpaceStore} from "../storages/gameSpace";
import content from "../../constants/content";

const {endModal} = content;

export function useEndGame() {
  const {wrapper} = useBasketballStore();
  const {redirect} = useAppCallbacks();
  const {names, add} = useModalProvider();

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: [WIN, LOSE],
          callback({status}) {
            wrapper.state = status;

            const {
              gameData: {story, pureCount, score},
            } = gameSpaceStore.gameSpace;
            const modalData = endModal({wrapper, modalNames: names, redirect, score, pureCount, status, story});
            add(modalData);
          },
        },
      ],
    });
  }, [wrapper]);
}
