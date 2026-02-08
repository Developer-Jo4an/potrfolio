import {useEffect} from "react";
import {eventSubscription, useAppCallbacks, useModalProvider} from "@shared";
import {events} from "../../constants/events";
import content from "../../constants/content";
import {useTileExplorerStore} from "../state-manager/tileExplorerStore";

const {endModal} = content;

export function useEndGame({gameSpace}) {
  const {wrapper} = useTileExplorerStore();
  const {redirect} = useAppCallbacks();
  const {names, add} = useModalProvider();

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: [events.win, events.lose],
          callback({status}) {
            const {score, currentTime} = gameSpace;
            const modalData = endModal({wrapper, modalNames: names, currentTime, redirect, score, status});
            add(modalData);
          }
        }
      ]
    });
  }, [wrapper, gameSpace]);
}
