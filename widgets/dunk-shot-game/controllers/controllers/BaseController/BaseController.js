import {eventSubscription} from "../../../../../shared/lib/events/eventListener";
import {DUNK_SHOT_CONFIG_EVENT, DUNK_SHOT_GAME_DATA_EVENT} from "../../../constants/events";
import {STATE_CHANGED} from "../../../../../shared/scene/constants/events/names";

export default class BaseController {
  constructor(data) {
    for (const key in data)
      this[key] = data[key];

    this.baseInit();
  }

  init() {

  }

  baseInit() {
    const {eventBus} = this;

    eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: STATE_CHANGED,
          callback: ({state}) => {
            this.state = state;
            this.onStateChanged?.(state);
          }
        },
        {
          event: DUNK_SHOT_GAME_DATA_EVENT,
          callback: ({gameData}) => this.gameData = gameData
        },
        {
          event: DUNK_SHOT_CONFIG_EVENT,
          callback: ({config}) => this.config = config
        }
      ]
    });
  }

  onStateChanged(state) {

  }
}
