import System from "../../../../shared/scene/ecs/core/System";
import State from "../../../../shared/scene/ecs/base/components/state/State";
import eventSubscription from "../../../../shared/lib/events/eventListener";
import {CLICK_ON_WINDOW} from "../../constants/events";
import {GAME} from "../../constants/entities/game";
import {PLAYING} from "../../constants/stateMachine";
import {LEFT, RIGHT} from "../../../../shared/constants/directions/directions";

export default class Input extends System {
  constructor() {
    super(...arguments);
    this.onClick = this.onClick.bind(this);
  }

  initializationLevelSelect() {
    this.initEvents();
  }

  initEvents() {
    const {storage: {gameSpace: {serviceData: {clearFunctions}}}} = this;

    clearFunctions.push(eventSubscription({
      callbacksBus: [{
        event: CLICK_ON_WINDOW,
        callback: this.onClick,
        options: {passive: true, capture: true}
      }]
    }));
  }

  onClick() {
    const gameEntity = this.getFirstEntityByType(GAME);
    const gameStateComponent = gameEntity.get(State);

    if (gameStateComponent.state !== PLAYING) return;

    const {storage: {gameSpace: {characterMovement}}} = this;
    characterMovement.currentDirection = {[LEFT]: RIGHT, [RIGHT]: [LEFT]}[characterMovement.currentDirection];
  }
}
