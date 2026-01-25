import {ROUTES} from "@shared";

export const cardsConfig = {
  activeGame: {translateX: 0, translateY: 0, translateZ: 0, rotateX: 0, rotateY: 0, rotateZ: 0},
  leftGame: {translateX: -155, translateY: 0, translateZ: -500, rotateX: 0, rotateY: 40, rotateZ: 0},
  rightGame: {translateX: 155, translateY: 0, translateZ: -500, rotateX: 0, rotateY: -40, rotateZ: 0},
  inactiveGame: {translateX: 0, translateY: 0, translateZ: -1000, rotateX: 0, rotateY: 0, rotateZ: 0}
};

export const cardsAnimationSettings = {
  showing: {activeGame: 0.3, leftGame: 0.55, rightGame: 0.8},
  flipping: {leftcenter: {translateX: -200, translateZ: -250}, rightcenter: {translateX: 200, translateZ: -250}}
};

export const gameList = [
  {
    id: "dunkShot",
    route: ROUTES.dunkShot,
    title: "Данк шот",
    description: "DunkShot - игра, созданная на референсе игры 'dunkShot' от ketchapp, pixi.js + matter.js"
  },
  {
    id: "basketball",
    route: ROUTES.basketball,
    title: "Баскетболл",
    description: "Баскетболл - игра на three.js+rapier, закидывание мячика в кольцо"
  },
  {
    id: "mario",
    title: "Марио",
    route: ROUTES.mario,
    description: "Mario - игра созданная по референсу оригинального Mario с помощью 2d фреймворка phaser"
  },
  {
    id: "car",
    title: "Машинка",
    route: ROUTES.car,
    description: "Машинка - что-то типо geometry dash, ecs, pixi.js, sat.js"
  },
  {
    id: "fruits",
    title: "Фрукты",
    route: ROUTES.fruits,
    description: "Фрукты - игра на pixi.js + matter.js"
  },
  {
    id: "drive",
    title: "Drive",
    route: ROUTES.drive,
    description: "Drive - игра, похожая механикой на flappy bird, только тут машинка, pixi.js"
  }
];
