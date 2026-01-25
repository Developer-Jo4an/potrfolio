import {System, Entity} from "@shared";
import {AbstractTree as CAbstractTree} from "../components/AbstractTree";
import {cloneDeep, isNull} from "lodash";
import {ABSTRACT_TREE} from "../entities/AbstractTree";

export class AbstractTree extends System {
  initializationLevelSelect() {
    this.initAbstractTree();
  }

  initAbstractTree() {
    const {
      eventBus,
      storage: {
        mainSceneSettings: {shift},
        config: {grid},
      },
    } = this;

    const abstractTree = [];

    for (let z = grid.length - 1; z >= 0; z--) {
      const layer = grid[z];

      const abstractRows = [];
      layer.forEach((row, y) => {
        const abstractRow = [];
        row.forEach((cell, x) => {
          const isUpperGrid = z === grid.length - 1;
          const upperGrid = !isUpperGrid && abstractTree[z + 1];
          const isHasUpperCell =
            upperGrid && shift.some(([shiftX, shiftY]) => !!upperGrid[y + shiftY]?.[shiftX + x]?.type);
          abstractRow[x] = cloneDeep({...cell, x, y, z, isBlocked: isHasUpperCell});
        });
        abstractRows.push(abstractRow);
      });
      abstractTree[z] = abstractRows;
    }

    new Entity({eventBus, type: ABSTRACT_TREE}).init();

    this.updateAbstractTree(abstractTree);
  }

  updateAbstractTree(tree) {
    const eAbstractTree = this.getFirstEntityByType(ABSTRACT_TREE);
    const cAbstractTree = eAbstractTree.get(CAbstractTree);
    cAbstractTree.tree = tree;
  }
}
