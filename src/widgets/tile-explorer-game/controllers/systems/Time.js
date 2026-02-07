import {System, Entity, STATE_DECORATOR_FIELD} from "@shared";
import {TIMER} from "../entities/timer";
import {LOSING} from "../../constants/stateMachine";

export class Time extends System {
  initializationLevelSelect() {
    const {
      eventBus,
      storage: {config, gameSpace}
    } = this;

    const eTimer = new Entity({eventBus, type: TIMER}).init();
    const {cTimer} = this.getTimerInfo();

    this.addSideEffect({
      entity: eTimer,
      effect() {
        cTimer.time = gameSpace.currentTime = config.timer;
        return () => (cTimer.time = gameSpace.currentTime = null);
      }
    });
  }

  updateTime(deltaS) {
    const {
      storage: {gameSpace}
    } = this;

    const {cTimer} = this.getTimerInfo();
    cTimer.time -= deltaS;

    const formatedTime = this.getFormattedTime();

    if (gameSpace.currentTime !== formatedTime) gameSpace.currentTime = formatedTime;

    this.checkOnLose(formatedTime);
  }

  checkOnLose(formatedTime) {
    if (formatedTime !== 0) return;

    const {storage: {decorators}} = this;

    const stateDecorator = decorators[STATE_DECORATOR_FIELD];
    stateDecorator.state = LOSING;
  }

  getFormattedTime() {
    const {time} = this.getTimerInfo();

    return Math.max(0, Math.round(time));
  }

  update({deltaMS}) {
    const deltaS = deltaMS / 1000;
    this.updateTime(deltaS);
  }
}
