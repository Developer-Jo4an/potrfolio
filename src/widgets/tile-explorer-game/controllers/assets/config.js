import {Cell} from "./Cell";
import {Shelf} from "./Shelf";
import {Container, Sprite} from "@shared";
import {labels} from "../../constants/labels";
import {TREE} from "../entities/tree";
import {CELL} from "../entities/cell";
import {SHELF} from "../entities/shelf";
import {SNOW, SNOWS_CONTAINER} from "../../constants/preload";

export const config = {
  [TREE]: {
    Cls: Container,
    baseSettings: {
      label: TREE,
      zIndex: 2
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
      label: labels.shelf.asset,
      zIndex: 1
    }
  },
  [SNOW]: {
    Cls: Sprite,
    baseSettings: {
      label: labels.snow.particle,
      anchor: {x: 0.5, y: 0.5},
      texture: SNOW
    }
  },
  [SNOWS_CONTAINER]: {
    Cls: Container,
    baseSettings: {
      label: labels.snow.container
    }
  }
};
