import eventSubscription from "../../../../shared/lib/events/eventListener";
import {STATE_CHANGED} from "../../../../shared/scene/constants/events/names";
import {DUNK_SHOT_CONFIG_EVENT, DUNK_SHOT_GAME_DATA_EVENT} from "../../constants/events";

export default function setNecessaryListeners(context) {
  const {eventBus} = context;

  eventSubscription({
    target: eventBus,
    callbacksBus: [
      {
        event: STATE_CHANGED,
        callback({state}) {
          context.state = state;
          context.onStateChanged?.(state);
        }
      },
      {
        event: DUNK_SHOT_GAME_DATA_EVENT,
        callback({gameData}) {
          context.gameData = gameData;
          context.onGameDataChanged?.(gameData);
        }
      },
      {
        event: DUNK_SHOT_CONFIG_EVENT,
        callback({config}) {
          context.config = config;
          context.onConfigChanged?.(config);
        }
      }
    ]
  });
}