import {Booster} from "./Booster";
import {events, treeActions} from "../entities/tree";
import {BACK} from "../constants/boosters";

export class Back extends Booster {
  static boosterName = BACK;

  actionData = {};

  get isAvailable() {
    const {system} = this;

    const {queue} = system.getShelfInfo();

    return !!queue.length;
  }

  apply() {
    super.apply();
    this.calculateBackData();
    this.dispatch();
  }

  calculateBackData() {
    const {actionData, system} = this;

    const {queue} = system.getShelfInfo();
    const {prevTrees} = system.getTreeInfo();

    const lastCell = queue[queue.length - 1];
    const {id} = system.getCellInfo(lastCell);

    for (let i = prevTrees.length - 1; i >= 0; i--) {
      const prevTree = prevTrees[i];

      const cellData = system.findInTree(
        prevTree,
        ({cell: {id: cellId, isInsidePool}}) => id === cellId && !isInsidePool
      );

      if (cellData?.cell) {
        actionData.necessaryCell = cellData.cell;
        break;
      }
    }
  }

  dispatch() {
    const {actionData, eventBus} = this;

    eventBus.dispatchEvent({
      type: events.update,
      cell: actionData.necessaryCell,
      action: treeActions.removeFromPool
    });
  }

  reset() {
    super.reset();
    this.actionData = {};
  }
}
