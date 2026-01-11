import {useEffect} from "react";
import eventSubscription from "../../../../shared/lib/events/eventListener";
import useBasketballStore from "../state-manager/basketballStore";
import {LOSE, WIN} from "../../constants/events";

export default function useEndGame() {
  const {wrapper} = useBasketballStore();

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: [WIN, LOSE], callback({status}) {
            wrapper.state = status;
          }
        }
      ]
    });
  }, [wrapper]);
}