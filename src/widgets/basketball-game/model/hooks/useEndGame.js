import {useEffect} from "react";
import {useAppCallbacks} from "@application/providers/callbacks";
import {eventSubscription} from "@shared";
import {useBasketballStore} from "../state-manager/basketballStore";
import {useModalStore} from "@application/providers/modal";
import {LOSE, WIN} from "../../constants/events";
import {gameSpaceStore} from "../storages/gameSpace";
import content from "../../constants/content";

const {endModal} = content;

export function useEndGame() {
  const {wrapper} = useBasketballStore();
  const {add} = useModalStore();
  const {redirect} = useAppCallbacks();

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

            const {gameData: {story, pureCount, score}} = gameSpaceStore.gameSpace;
            const modalData = endModal({wrapper, redirect, score, pureCount, status, story});
            add(modalData);
          }
        }
      ]
    });
  }, [wrapper]);
}
