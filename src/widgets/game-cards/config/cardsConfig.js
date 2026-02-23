import {ROUTES} from "@shared";

export const cardsConfig = {
  activeGame: {translateX: 0, translateY: 0, translateZ: 0, rotateX: 0, rotateY: 0, rotateZ: 0},
  leftGame: {translateX: -155, translateY: 0, translateZ: -500, rotateX: 0, rotateY: 40, rotateZ: 0},
  rightGame: {translateX: 155, translateY: 0, translateZ: -500, rotateX: 0, rotateY: -40, rotateZ: 0},
  inactiveGame: {translateX: 0, translateY: 0, translateZ: -1000, rotateX: 0, rotateY: 0, rotateZ: 0}
};

export const gameList = [
  {
    id: "dunkShot",
    route: ROUTES.dunkShot,
    title: "Dunk Shot",
    description: "pixi, matter, gsap"
  },
  {
    id: "basketball",
    route: ROUTES.basketball,
    title: "Basketball",
    description: "ecs, three, rapier3d, gsap"
  },
  {
    id: "car",
    title: "Geometry dash vertical",
    route: ROUTES.car,
    description: "ecs, pixi, sat, gsap"
  },
  {
    id: "tileExplorer",
    title: "Проводник плиток",
    route: ROUTES.tileExplorer,
    description: "ecs, pixi, gsap"
  }
];
