import {Container} from "@shared";
import {Enemy} from "./Enemy";
import {Platform} from "./Platform";
import {Character} from "./Character";
import {Item} from "./Item";
import {CHARACTER} from "../../entities/character";
import {PLATFORM} from "../../entities/platform";
import {MAIN_CONTAINER} from "../../entities/mainContainer";
import {ENEMY} from "../../entities/enemy";
import {BULLET} from "../../entities/bullet";
import {BOOSTER} from "../../entities/booster";
import {HELPER} from "../../entities/helper";

export const factory = {
  [MAIN_CONTAINER]: {
    Cls: Container,
    baseSettings: {
      label: MAIN_CONTAINER,
    },
  },
  [CHARACTER]: {
    Cls: Character,
    baseSettings: {
      label: CHARACTER,
      zIndex: 3,
    },
  },
  [PLATFORM]: {
    Cls: Platform,
    baseSettings: {
      label: PLATFORM,
      zIndex: 1,
      anchor: {x: 0.5, y: 0.5},
    },
  },
  [ENEMY]: {
    Cls: Enemy,
    baseSettings: {
      label: ENEMY,
      zIndex: 1,
      anchor: {x: 0.5, y: 0.5},
    },
  },
  [BULLET]: {
    Cls: Item,
    baseSettings: {
      label: BULLET,
      anchor: {x: 0.5, y: 0.5},
      zIndex: 2,
    },
  },
  [BOOSTER]: {
    Cls: Item,
    baseSettings: {
      label: BOOSTER,
      anchor: {x: 0.5, y: 0.5},
      zIndex: 2,
    },
  },
  [HELPER]: {
    Cls: Item,
    baseSettings: {
      label: HELPER,
      anchor: {x: 0.5, y: 0.5},
      zIndex: 2,
    },
  },
};
