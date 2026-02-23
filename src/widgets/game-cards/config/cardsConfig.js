import {ROUTES} from "@shared";

export const cardsConfig = {
  activeGame: {translateX: 0, translateY: 0, translateZ: 0, rotateX: 0, rotateY: 0, rotateZ: 0},
  leftGame: {translateX: -155, translateY: 0, translateZ: -500, rotateX: 0, rotateY: 40, rotateZ: 0},
  rightGame: {translateX: 155, translateY: 0, translateZ: -500, rotateX: 0, rotateY: -40, rotateZ: 0},
  inactiveGame: {translateX: 0, translateY: 0, translateZ: -1000, rotateX: 0, rotateY: 0, rotateZ: 0},
};

export const gameList = [
  {
    id: "dunkShot",
    route: ROUTES.dunkShot,
    title: "Данк шот",
    description: "DunkShot - игра, созданная на референсе игры 'dunkShot' от ketchapp, pixi.js + matter.js",
  },
  {
    id: "basketball",
    route: ROUTES.basketball,
    title: "Баскетболл",
    description: "Баскетболл - игра на three.js+rapier, закидывание мячика в кольцо",
  },
  {
    id: "car",
    title: "Машинка",
    route: ROUTES.car,
    description: "Машинка - что-то типо geometry dash, ecs, pixi.js, sat.js",
  },
  {
    id: "tileExplorer",
    title: "Tile explorer",
    route: ROUTES.tileExplorer,
    description: "Tile explorer",
  },
];
