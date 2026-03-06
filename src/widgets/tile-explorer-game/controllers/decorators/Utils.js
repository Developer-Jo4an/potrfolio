import {Tree} from "../components/Tree";
import {Cell} from "../components/Cell";
import {Queue} from "../components/Queue";
import {Bounds} from "../components/Bounds";
import {Booster} from "../components/Booster";
import {Timer} from "../components/Timer";
import {PixiComponent, Tween, Decorator, Promise as CPromise, Matrix3Component} from "@shared";
import {CELL} from "../entities/cell";
import {BOUNDS} from "../entities/bounds";
import {BOOSTER} from "../entities/booster";
import {TREE} from "../entities/tree";
import {SHELF} from "../constants/preload";
import {ANIMATION_TREE} from "../entities/animationTree";
import {TIMER} from "../entities/timer";

export class Utils extends Decorator {
  /**
   * shortcuts
   */
  getBoundsInfo() {
    const eBounds = this.getFirstEntityOrCreate(BOUNDS);
    const cBounds = eBounds.get(Bounds);

    const {
      bounds,
      bounds: {tree, shelf, queue},
    } = cBounds;

    return {cBounds, bounds, tree, shelf, queue};
  }

  getBoosterInfo() {
    const eBooster = this.getFirstEntityOrCreate(BOOSTER);

    const cPromise = eBooster.get(CPromise);

    const cBooster = eBooster.get(Booster);
    const {type, isActive} = cBooster;

    const cTween = eBooster.get(Tween);

    return {entity: eBooster, cBooster, cTween, type, isActive, cPromise};
  }

  getTreeInfo() {
    const eTree = this.getFirstEntityByType(TREE);

    const cTree = eTree.get(Tree);
    const {tree, prevTrees} = cTree;

    const cPixi = eTree.get(PixiComponent);
    const {pixiObject: view} = cPixi;

    const cMatrix3 = eTree.get(Matrix3Component);

    return {entity: eTree, cPixi, cTree, tree, prevTrees, view, cMatrix3};
  }

  getCellInfo(eCell) {
    const cCell = eCell.get(Cell);
    const {x, y, z, isBlocked, isResolved, isInsidePool, type, id} = cCell;

    const cPixi = eCell.get(PixiComponent);
    const {pixiObject: view} = cPixi;

    const cMatrix3 = eCell.get(Matrix3Component);

    const cPromise = eCell.get(CPromise);

    const cTween = eCell.get(Tween);

    return {
      entity: eCell,
      cCell,
      cPixi,
      x,
      y,
      z,
      id,
      isResolved,
      isInsidePool,
      isBlocked,
      type,
      view,
      cMatrix3,
      cPromise,
      cTween,
      cell: {x, y, z, isBlocked, isResolved, isInsidePool, type, id},
    };
  }

  getShelfInfo() {
    const eShelf = this.getFirstEntityByType(SHELF);

    const cQueue = eShelf.get(Queue);
    const {queue, prevQueues, max} = cQueue;

    const types = queue.map((eCell) => eCell.get(Cell).type);

    const cPixi = eShelf.get(PixiComponent);
    const {pixiObject: view} = cPixi;

    const cMatrix3 = eShelf.get(Matrix3Component);

    return {entity: eShelf, cShelf: cQueue, cPixi, queue, cMatrix3, prevQueues, types, max, view};
  }

  getAnimationTreeInfo() {
    const eAnimationTree = this.getFirstEntityByType(ANIMATION_TREE);

    const cQueue = eAnimationTree.get(Queue);
    const {queue, prevQueues, max} = cQueue;

    return {entity: eAnimationTree, cQueue, queue, prevQueues, max};
  }

  getTimerInfo() {
    const eTimer = this.getFirstEntityByType(TIMER);

    const cTimer = eTimer.get(Timer);
    const {time} = cTimer;

    return {entity: eTimer, cTimer, time};
  }

  /**
   * tree
   */
  runTree(tree, callback) {
    for (let z = tree.length - 1; z >= 0; z--) {
      const layer = tree[z];
      for (let y = 0; y < layer.length; y++) {
        const row = layer[y];
        for (let x = 0; x < row.length; x++) {
          const cell = row[x];
          const isBrake = callback({x, y, z, layer, row, cell});
          if (isBrake) return;
        }
      }
    }
  }

  findInTree(tree, callback) {
    let result;

    this.runTree(tree, (cellData) => {
      const isTruth = callback(cellData);

      if (isTruth) {
        result = cellData;
        return true;
      }
    });

    return result;
  }

  setToTree(tree, x, y, z, cell) {
    !tree[z] && (tree[z] = []);
    !tree[z][y] && (tree[z][y] = []);
    tree[z][y][x] = cell;
  }

  getFromTree(tree, x, y, z) {
    return tree?.[z]?.[y]?.[x];
  }

  recalculateCellsProperties(iterateTree, newTree = []) {
    this.runTree(iterateTree, ({x, y, z, cell}) => {
      const isBlocked = this.calculateIsBlocked(iterateTree, x, y, z);
      const cellData = {...cell, isBlocked};

      this.setToTree(newTree, x, y, z, cellData);

      const {cCell, view} = this.getCellInfoById(cell.id);
      Object.assign(cCell, cellData);

      if (view) {
        const {isBlocked, isInsidePool, isResolved} = cellData;

        const isDisabled = isBlocked || isInsidePool || isResolved;

        isDisabled ? this.disableCellView(view) : this.enableCellView(view);
      }
    });

    return newTree;
  }

  /**
   * cells
   */
  calculateIsBlocked(tree, cellX, cellY, cellZ) {
    const {
      storage: {
        mainSceneSettings: {shifts},
      },
    } = this;

    let isHasUpper = false;

    const current = this.getFromTree(tree, cellX, cellY, cellZ);

    if (current.isInsidePool || current.isResolved) return false;

    const isHonest = !!(cellZ % 2);

    const shift = isHonest ? shifts.honest : shifts.odd;

    for (let z = cellZ + 1; z < tree.length; z++) {
      const isHasShift = !!((z - cellZ) % 2);

      let isBlocked = false;

      if (isHasShift) {
        isBlocked = shift.some(([shiftX, shiftY]) => {
          const x = shiftX + cellX;
          const y = shiftY + cellY;
          const cell = this.getFromTree(tree, x, y, z);
          return isHasUpperCell(cell);
        });
      } else {
        const cell = this.getFromTree(tree, cellX, cellY, z);
        isBlocked = isHasUpperCell(cell);
      }

      if (isBlocked) {
        isHasUpper = true;
        break;
      }
    }

    function isHasUpperCell(cell) {
      return cell?.type && !cell.isInsidePool;
    }

    return isHasUpper;
  }

  createCell(x, y, z) {
    return {x, y, z, id: crypto.randomUUID(), type: null, isInsidePool: false, isResolved: false, isBlocked: false};
  }

  getAvailableCells(tree) {
    const availableCells = [];
    this.runTree(tree, ({cell}) => {
      if (this.isAvailableCell(cell)) availableCells.push(cell);
    });
    return availableCells;
  }

  isAvailableCell(cell) {
    return !cell.isBlocked && !cell.isResolved && !cell.isInsidePool && !!cell.type;
  }

  getCellInfoByXYZ(cellX, cellY, cellZ) {
    const eCells = this.getEntitiesByType(CELL).list;

    return this.getCellInfo(
      eCells.find((eCell) => {
        const {x, y, z} = eCell.get(Cell);
        return x === cellX && y === cellY && z === cellZ;
      }),
    );
  }

  getCellInfoById(id) {
    const eCells = this.getEntitiesByType(CELL).list;

    return this.getCellInfo(
      eCells.find((eCell) => {
        const {id: uid} = eCell.get(Cell);
        return uid === id;
      }),
    );
  }

  disableCellView(cellView) {
    cellView.eventMode = "none";
    cellView.cursor = null;
  }

  enableCellView(cellView) {
    cellView.eventMode = "static";
    cellView.cursor = "pointer";
  }

  /**
   * shelf
   */
  calculateNewQueue(prevQueue, eCell) {
    const {type} = this.getCellInfo(eCell);

    const newQueue = [...prevQueue];

    const lastCellByCurrentType = newQueue.findLastIndex((eCell) => {
      const {type: cellType} = this.getCellInfo(eCell);
      return cellType === type;
    });

    if (lastCellByCurrentType !== -1) {
      newQueue.splice(lastCellByCurrentType + 1, 0, eCell);
    } else {
      newQueue.push(eCell);
    }

    return newQueue;
  }

  reduceShelfTypes(shelf) {
    return shelf.reduce((acc, eCell) => {
      const {type} = this.getCellInfo(eCell);
      acc[type] ??= [];
      acc[type].push(eCell);
      return acc;
    }, {});
  }

  getChunksByTarget(arr) {
    const {
      storage: {
        mainSceneSettings: {
          shelf: {target},
        },
      },
    } = this;

    return arr.reduce((acc, _, i) => {
      if (!(i % target)) acc.push(arr.slice(i, i + target));
      return acc;
    }, []);
  }

  isHasTruthCombination(types) {
    const {
      storage: {
        mainSceneSettings: {
          shelf: {target},
        },
      },
    } = this;

    const truthCombination = {};

    for (const type of types) {
      if (!truthCombination[type]) truthCombination[type] = 0;

      truthCombination[type] += 1;

      if (truthCombination[type] === target) return true;
    }

    return false;
  }

  /**
   * other
   */
  waitAllPromises() {
    const {allComponents} = this;

    const allPromises = allComponents.reduce((acc, component) => {
      if (component instanceof CPromise) acc.push(...component.getAll());
      return acc;
    }, []);

    return Promise.all(allPromises);
  }
}
