import {Queue} from "../components/Queue";
import {upperFirst} from "lodash";
import {eventSubscription, System, clone, Entity, STATE_DECORATOR_FIELD} from "@shared";
import {TREE, treeActions, events as treeEvents} from "../entities/tree";
import {SHELF} from "../entities/shelf";
import {LOSING, WINNING} from "../../constants/stateMachine";

export class Tree extends System {
  constructor() {
    super(...arguments);

    this.onUpdate = this.onUpdate.bind(this);
  }

  initializationLevelSelect() {
    this.initTree();
    this.initShelf();
    this.initEvents();
  }

  initTree() {
    const {
      eventBus,
      storage: {
        config: {grid}
      }
    } = this;

    const tree = [];

    this.runTree(grid, ({x, y, z, cell}) => {
      const isBlocked = this.calculateIsBlocked(grid, x, y, z);

      const newCell = this.createCell(x, y, z);
      const newData = {isBlocked, type: cell.type};

      Object.assign(newCell, newData);

      this.setToTree(tree, x, y, z, newCell);
    });

    new Entity({eventBus, type: TREE}).init();
    const {cTree} = this.getTreeInfo();
    cTree.tree = tree;
  }

  initShelf() {
    const {
      storage: {
        mainSceneSettings: {shelf}
      }
    } = this;

    const eShelf = this.getFirstEntityOrCreate(SHELF);
    const cShelf = eShelf.get(Queue);
    cShelf.max = shelf.cagesCount;
  }

  initEvents() {
    const {
      storage: {
        serviceData: {clearFunctions}
      },
      eventBus
    } = this;

    const clear = eventSubscription({
      target: eventBus,
      callbacksBus: [{event: treeEvents.update, callback: this.onUpdate}]
    });

    clearFunctions.push(clear);
  }

  onUpdate({action}) {
    const {eventBus} = this;

    const treeMethod = createMethod(TREE, action);
    const shelfMethod = createMethod(SHELF, action);

    this[treeMethod]?.(...arguments);
    this[shelfMethod]?.(...arguments);

    eventBus.dispatchEvent({type: treeEvents.updated});

    this.checkOnEnd();
  }

  [createMethod(TREE, treeActions.addToPool)]({entity}) {
    const {
      storage: {
        mainSceneSettings: {
          shelf: {target}
        }
      }
    } = this;

    const {type, cell} = this.getCellInfo(entity);
    const {queue} = this.getShelfInfo();
    const {cTree, tree} = this.getTreeInfo();

    const updatedTree = clone(tree);
    this.setToTree(updatedTree, cell.x, cell.y, cell.z, {...cell, isInsidePool: true});

    const groupedEntities = queue.reduce(
      (acc, eCell) => {
        const {type} = this.getCellInfo(eCell);
        (acc[type] ??= []).push(eCell);
        return acc;
      },
      {[type]: [entity]}
    );

    const resolvedEntities = Object.values(groupedEntities).find(({length}) => length === target);

    if (resolvedEntities)
      resolvedEntities.forEach(eCell => {
        const {cCell} = this.getCellInfo(eCell);
        const cellData = {...this.getFromTree(tree, cCell.x, cCell.y, cCell.z), isInsidePool: true, isResolved: true};
        Object.assign(cCell, cellData);
        this.setToTree(updatedTree, cellData);
      });

    cTree.tree = this.recalculateCellsProperties(updatedTree);
  }

  [createMethod(SHELF, treeActions.addToPool)]({entity}) {
    const {
      storage: {
        mainSceneSettings: {
          shelf: {target}
        }
      }
    } = this;

    const {cShelf, queue} = this.getShelfInfo();
    const {type} = this.getCellInfo(entity);

    const resolvedCells = [];

    for (const eCellInQueue of queue) {
      const {type: cellType} = this.getCellInfo(eCellInQueue);

      cellType === type && resolvedCells.push(eCellInQueue);

      if (resolvedCells.length === target - 1) {
        cShelf.queue = queue.filter(eCell => !resolvedCells.includes(eCell));
        return;
      }
    }

    cShelf.queue = this.calculateNewQueue(queue, entity);
  }

  [createMethod(TREE, treeActions.removeFromPool)]({cell}) {
    const {tree: currentTree, cTree} = this.getTreeInfo();

    const updatedTree = clone(currentTree);
    this.setToTree(updatedTree, cell.x, cell.y, cell.z, cell);

    cTree.tree = this.recalculateCellsProperties(updatedTree);
  }

  [createMethod(SHELF, treeActions.removeFromPool)]() {
    const {cShelf, queue} = this.getShelfInfo();

    const newQueue = [...queue];
    newQueue.pop();
    cShelf.queue = newQueue;
  }

  checkOnEnd() {
    const {storage: {decorators}} = this;

    const {tree} = this.getTreeInfo();
    const {queue, types, max} = this.getShelfInfo();
    const availableCells = this.getAvailableCells(tree);

    if (!availableCells.length && !queue.length) {
      const stateDecorator = decorators[STATE_DECORATOR_FIELD];
      stateDecorator.state = WINNING;
      return;
    }

    if (queue.length < max - 1) return;

    const isFullShelf = queue.length === max;
    if (isFullShelf) {
      const stateDecorator = decorators[STATE_DECORATOR_FIELD];
      stateDecorator.state = LOSING;
      return;
    }

    const isLose = availableCells.every(({type}) => {
      const possibleShelfTypes = [...types, type];
      return !this.isHasTruthCombination(possibleShelfTypes);
    });

    if (isLose) {
      const stateDecorator = decorators[STATE_DECORATOR_FIELD];
      stateDecorator.state = LOSING;
    }
  }
}

function createMethod(entity, action) {
  return `on${upperFirst(entity)}${upperFirst(action)}`;
}
