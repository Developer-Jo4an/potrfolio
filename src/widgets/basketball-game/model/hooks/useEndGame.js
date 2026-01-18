import {useEffect} from "react";
import eventSubscription from "../../../../shared/lib/src/events/eventListener";
import {useAppCallbacks} from "../../../../application/providers/callbacks/ui/main/CallbacksProvider";
import useBasketballStore from "../state-manager/basketballStore";
import useModalStore from "../../../../application/providers/modal/model/state-manager/stores/modalStore";
import {LOSE, WIN} from "../../constants/events";
import gameSpaceStore from "../storages/gameSpace";
import content from "../../constants/content";

const {endModal} = content;

export default function useEndGame() {
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
