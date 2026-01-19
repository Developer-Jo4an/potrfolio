import {upperFirst} from "lodash";
import {GAME} from "../../constants/entities/game";
import {CHARACTER} from "../../constants/entities/character";
import {BONUSES_COLLISION, SPIKES_COLLISION} from "../../constants/events";
import {EventComponent, System} from "@shared";

export class Event extends System {
  [`on${upperFirst(CHARACTER)}${upperFirst(BONUSES_COLLISION)}`]({event: {data}}) {
    const {eventBus} = this;
    eventBus.dispatchEvent({type: BONUSES_COLLISION, count: data?.length});
  }

  [`on${upperFirst(CHARACTER)}${upperFirst(SPIKES_COLLISION)}`]({event: {data}}) {
    const {eventBus} = this;
    eventBus.dispatchEvent({type: SPIKES_COLLISION, count: data?.length});
  }

  trackEvents({gameEntity, characterEntity}) {
    [gameEntity, characterEntity].forEach(entity => {
      const events = entity.getList(EventComponent);
      const savedList = [...events];
      savedList.forEach(event => {
        const callbackKey = `on${upperFirst(entity.type)}${upperFirst(event.type)}`;
        this[callbackKey]({...arguments, event});
        entity.remove(event);
      });
    });
  }

  update() {
    const gameEntity = this.getFirstEntityByType(GAME);
    const characterEntity = this.getFirstEntityByType(CHARACTER);
    const fullArguments = {gameEntity, characterEntity, arguments};
    this.trackEvents(fullArguments);
  }
}
