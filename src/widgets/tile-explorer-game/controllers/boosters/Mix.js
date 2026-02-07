import {Booster} from "./Booster";
import {Shuffle} from "../tweens/tweens/Shuffle";
import {clone, isEqual, shuffle} from "lodash";
import {tweens} from "../../constants/tweens";

export class Mix extends Booster {
  static boosterName = "mix";

  static limit = 10;

  actionData = {};

  async apply() {
    super.apply();

    this.shuffle();
    this.setToOriginalTree();
    this.shuffleView();
    await this.animate();
  }

  shuffle() {
    const {actionData, system} = this;

    const {queue} = system.getShelfInfo();
    const {tree} = system.getTreeInfo();

    const shuffledTree = this.shuffleTree(tree);
    const isHasStep = this.isHasStep(shuffledTree, queue);
    const isIdentifyTrees = this.isIdentifyTrees(tree, shuffledTree);

    const isLuck = isHasStep && !isIdentifyTrees;

    if (isLuck) {
      actionData.shuffledTree = shuffledTree;
      return;
    }

    this.shuffle();
  }

  async animate() {
    const {
      actionData: {animatedData},
      system,
    } = this;

    const {cTween, cPromise} = system.getBoosterInfo();

    const shuffleTween = new Shuffle({
      vars: {
        animateObjects: animatedData,
        onComplete() {
          cTween.remove(shuffleTween, tweens.shuffle);
        },
      },
    });
    cTween.add(shuffleTween, tweens.shuffle);
    cPromise.add(shuffleTween.promise);

    await shuffleTween.promise;
  }

  reset() {
    super.reset();
    this.actionData = {};
  }

  setToOriginalTree() {
    const {
      actionData: {shuffledTree},
      system,
    } = this;

    const {cTree} = system.getTreeInfo();

    cTree.tree = shuffledTree;
  }

  shuffleTree(tree) {
    const {system} = this;

    const allAvailablePositions = [];

    system.runTree(tree, ({x, y, z}) => {
      if (this.isCanShuffle(tree, x, y, z)) allAvailablePositions.push({x, y, z});
    });

    const shuffledPositions = shuffle(allAvailablePositions);

    const newTree = [];

    system.runTree(tree, cellData => {
      const {x, y, z, cell} = cellData;

      const isCanShuffle = this.isCanShuffle(tree, x, y, z);

      if (!isCanShuffle) {
        system.setToTree(newTree, x, y, z, cell);
        return;
      }

      const [newPosition] = shuffledPositions.splice(0, 1);

      const isBlocked = system.calculateIsBlocked(tree, newPosition.x, newPosition.y, newPosition.z);

      system.setToTree(
        newTree,
        newPosition.x,
        newPosition.y,
        newPosition.z,
        clone({...cell, isBlocked, ...newPosition})
      );
    });

    return newTree;
  }

  shuffleView() {
    const {
      actionData,
      actionData: {shuffledTree},
      storage: {
        mainSceneSettings: {
          cell: {tint},
        },
      },
      system,
    } = this;

    actionData.animatedData = [];

    const callbacksAfterShuffle = [];

    system.runTree(shuffledTree, ({x, y, z, cell: {id, isBlocked, isInsidePool, isResolved}}) => {
      const isCanShuffle = this.isCanShuffle(shuffledTree, x, y, z);

      if (!isCanShuffle) return;

      const {entity: eCurrentCell} = system.getCellInfoById(id);
      const {entity: eTargetCell} = system.getCellInfoByXYZ(x, y, z);

      if (eCurrentCell === eTargetCell) return;

      const {cMatrix3: currentCMatrix3, cCell: currentCCell, view: currentView} = system.getCellInfo(eCurrentCell);
      const {cMatrix3: targetCMatrix3} = system.getCellInfo(eTargetCell);

      const animationSettings = {
        animateObject: currentCMatrix3,
        view: currentView,
        vars: {
          tint: isBlocked ? tint.invisible : tint.visible,
          x: targetCMatrix3.x,
          y: targetCMatrix3.y,
          zIndex: z,
        },
      };

      actionData.animatedData.push(animationSettings);

      callbacksAfterShuffle.push(() => {
        const newData = {x, y, z, isBlocked, isInsidePool, isResolved};

        Object.assign(currentCCell, newData);

        isBlocked ? system.disableCellView(currentView) : system.enableCellView(currentView);
      });
    });

    callbacksAfterShuffle.forEach(callback => callback());
  }

  isHasStep(tree, state) {
    const {system} = this;

    const {max} = system.getShelfInfo();
    if (state.length === max) return;

    const availableCells = system.getAvailableCells(tree);
    if (!availableCells.length) return false;

    if (state.length !== max - 1) return true;

    const necessaryTypes = availableCells.map(({type}) => type);
    const availableTypes = Array.from(new Set(necessaryTypes));

    const queueTypes = state.map(({type}) => type);

    return availableTypes.some(type => {
      const types = [...queueTypes, type];
      return system.isHasTruthCombination(types);
    });
  }

  isCanShuffle(tree, x, y, z) {
    const {system} = this;

    const cell = system.getFromTree(tree, x, y, z);

    return !!cell && !!cell.type && !cell.isResolved && !cell.isInsidePool;
  }

  isIdentifyTrees(tree1, tree2) {
    return isEqual(tree1, tree2);
  }
}
