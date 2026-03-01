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
    title: "Dunk Shot",
    description: "pixi, matter, gsap",
    background: {
      src: `widgets/game-cards/backgrounds/dunkShot.png`,
      width: 1600,
      height: 900,
      quality: 50,
    },
    img: {
      src: `widgets/game-cards/cards/dunkShot.png`,
      width: 280,
      height: 400,
      quality: 50,
    },
  },
  {
    id: "basketball",
    route: ROUTES.basketball,
    title: "Basketball",
    description: "ecs, three, rapier3d, gsap",
    background: {
      src: `widgets/game-cards/backgrounds/basketball.png`,
      width: 1600,
      height: 900,
      quality: 50,
    },
    img: {
      src: `widgets/game-cards/cards/basketball.png`,
      width: 280,
      height: 400,
      quality: 50,
    },
  },
  {
    id: "doodleJump",
    route: ROUTES.doodleJump,
    title: "DoodleJump",
    description: "ecs, pixi, sat, gsap",
    background: {
      src: `widgets/game-cards/backgrounds/doodleJump.png`,
      width: 1600,
      height: 900,
      quality: 75,
    },
    img: {
      src: `widgets/game-cards/cards/doodleJump.png`,
      width: 280,
      height: 400,
      quality: 100,
    },
  },
  {
    id: "car",
    title: "Geometry dash vertical",
    route: ROUTES.car,
    description: "ecs, pixi, sat, gsap",
    background: {
      src: `widgets/game-cards/backgrounds/car.png`,
      width: 1600,
      height: 900,
      quality: 75,
    },
    img: {
      src: `widgets/game-cards/cards/car.png`,
      width: 280,
      height: 400,
      quality: 50,
    },
  },
  {
    id: "tileExplorer",
    title: "Проводник плиток",
    route: ROUTES.tileExplorer,
    description: "ecs, pixi, gsap",
    background: {
      src: `widgets/game-cards/backgrounds/tileExplorer.png`,
      width: 1600,
      height: 900,
      quality: 75,
    },
    img: {
      src: `widgets/game-cards/cards/tileExplorer.png`,
      width: 280,
      height: 400,
      quality: 50,
    },
  },
];
