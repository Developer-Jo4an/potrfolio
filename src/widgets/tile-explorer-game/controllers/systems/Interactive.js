import {eventSubscription, ON_OFF_MODE, State, System} from "@shared";
import {CELL} from "../entities/cell";
import {treeActions, events} from "../entities/tree";
import {statesData} from "../constants/state";

export class Interactive extends System {
  initializationLevelSelect() {
    this.initInteractive();
  }

  initInteractive() {
    const cells = this.getEntitiesByType(CELL).list;

    cells.forEach((eCell) => {
      const {view} = this.getCellInfo(eCell);

      if (!view) return;

      this.addSideEffect({
        entity: eCell,
        effect: () => {
          return eventSubscription({
            target: view,
            callbacksBus: [{event: "pointertap", callback: (e) => this.onClick(e, eCell)}],
            ...ON_OFF_MODE,
          });
        },
      });
    });
  }

  get isInteractive() {
    const eGame = this.getFirstEntityByType("game");
    const state = eGame.get(State).state;

    const {cBooster} = this.getBoosterInfo();

    return statesData.availableInteractive.includes(state) && !cBooster.isActive;
  }

  onClick({currentTarget}, entity) {
    const {eventBus, isInteractive} = this;
    if (isInteractive) eventBus.dispatchEvent({type: events.update, entity, action: treeActions.addToPool});
  }
}
