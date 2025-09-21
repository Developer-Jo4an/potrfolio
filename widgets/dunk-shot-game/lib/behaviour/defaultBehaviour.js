import {eventSubscription} from "../../../../shared/lib/events/eventListener";
import {STATE_CHANGED} from "../../../../shared/scene/constants/events/names";

export const defaultBehaviour = context => {
  const {eventBus, gameDataEvent, configEvent} = context;

  const callbacksBus = [
    {
      event: STATE_CHANGED,
      callback({state}) {
        context.state = state;
        context.onStateChanged?.(state);
      }
    },
    gameDataEvent && {
      target: window,
      event: gameDataEvent,
      callback({detail: gameData}) {
        context.gameData = gameData;
        context.onGameDataChanged?.(gameData);
      }
    },
    configEvent && {
      target: window,
      event: configEvent,
      callback({detail: config}) {
        context.config = config;
        context.onConfigChanged?.(config);
      }
    }
  ].filter(Boolean);

  eventSubscription({target: eventBus, callbacksBus});
};
