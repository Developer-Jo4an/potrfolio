import {Cell} from "./Cell";
import {Shelf} from "./Shelf";
import {Container} from "@shared";
import {labels} from "../../constants/labels";
import {TREE} from "../../constants/entities/tree";
import {CELL} from "../../constants/entities/cell";
import {SHELF} from "../../constants/entities/shelf";

export const config = {
  [TREE]: {
    Cls: Container,
    baseSettings: {
      label: TREE,
      zIndex: 1
    }
  },
  [CELL]: {
    Cls: Cell,
    baseSettings: {
      label: labels.cell.asset
    }
  },
  [SHELF]: {
    Cls: Shelf,
    baseSettings: {
      label: labels.shelf.asset
    }
  }
};
