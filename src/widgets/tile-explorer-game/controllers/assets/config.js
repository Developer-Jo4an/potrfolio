import {Cell} from "./Cell";
import {Shelf} from "./Shelf";
import {Container} from "@shared";
import {SnowsContainer} from "./SnowsContainer";
import {labels} from "../constants/labels";
import {TREE} from "../entities/tree";
import {CELL} from "../entities/cell";
import {SHELF} from "../entities/shelf";
import {SNOWS_CONTAINER} from "../constants/preload";

export const config = {
  [TREE]: {
    Cls: Container,
    baseSettings: {
      label: TREE,
      zIndex: 2,
    },
  },
  [CELL]: {
    Cls: Cell,
    baseSettings: {
      label: labels.cell.asset,
    },
  },
  [SHELF]: {
    Cls: Shelf,
    baseSettings: {
      label: labels.shelf.asset,
      zIndex: 1,
    },
  },
  [SNOWS_CONTAINER]: {
    Cls: SnowsContainer,
    baseSettings: {
      label: labels.snow.container,
    },
  },
};
