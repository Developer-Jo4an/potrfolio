import {System} from "@shared";
import {cloneDeep} from "lodash";

export class Level extends System {
  initializationLevelSelect() {
    this.initGrid();
  }

  initGrid() {
    this.initAbstractTree();

  }

  initAbstractTree() {
    const {storage: {config: {grid}, gameSpace: {set}}} = this;

    const abstractTree = [];

    for (let i = grid.length - 1; i >= 0; i--) {
      const rows = grid[i];

      const abstractRows = [];
      rows.forEach((row, y) => {
        const abstractRow = [];

        row.forEach((cell, x) => {
          const isBlocked = i !== grid.length - 1; // [x;y] [x-1;y] [x;y-1] [x-1;y-1]
          abstractRow[x] = cloneDeep({...cell, x, y, isBlocked});
        });

        abstractRows.push(abstractRow);
      });

      abstractTree[i] = abstractRows;
    }

    set(gameSpace => {
      gameSpace.abstractTree = abstractTree;
    });
  }

  update() {

  }
}