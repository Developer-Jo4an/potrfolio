import {TEXTURE, assets} from "@shared";

export const BALL_2D = "2dBall";
export const AIM = "aim";
export const BASKET_BURNING_BACK = "basketBurningBack";
export const BASKET_BURNING_FRONT = "basketBurningFront";
export const BASKET_BURNING_GRID_FRONT = "basketBurningGridFront";
export const BASKET_ETERNAL_BACK = "basketEternalBack";
export const BASKET_ETERNAL_FRONT = "basketEternalFront";
export const BASKET_ETERNAL_GRID_FRONT = "basketEternalGridFront";
export const BASKET_GRID_BACK = "basketGridBack";
export const WING = "wing";
export const FINISH = "finish";
export const FINISH_LINE = "finishLine";
export const SPIKE = "spike";

export const preload = [
  {type: TEXTURE, name: BALL_2D, src: assets("dunkShot/2dBall.png")},
  {type: TEXTURE, name: AIM, src: assets("dunkShot/aim.png")},
  {type: TEXTURE, name: BASKET_BURNING_BACK, src: assets("dunkShot/basket-burning-back.png")},
  {type: TEXTURE, name: BASKET_BURNING_FRONT, src: assets("dunkShot/basket-burning-front.png")},
  {type: TEXTURE, name: BASKET_BURNING_GRID_FRONT, src: assets("dunkShot/basket-burning-grid-front.png")},
  {type: TEXTURE, name: BASKET_ETERNAL_BACK, src: assets("dunkShot/basket-eternal-back.png")},
  {type: TEXTURE, name: BASKET_ETERNAL_FRONT, src: assets("dunkShot/basket-eternal-front.png")},
  {type: TEXTURE, name: BASKET_ETERNAL_GRID_FRONT, src: assets("dunkShot/basket-eternal-grid-front.png")},
  {type: TEXTURE, name: BASKET_GRID_BACK, src: assets("dunkShot/basket-grid-back.png")},
  {type: TEXTURE, name: WING, src: assets("dunkShot/wing.png")},
  {type: TEXTURE, name: FINISH, src: assets("dunkShot/finish.png")},
  {type: TEXTURE, name: FINISH_LINE, src: assets("dunkShot/finish-line.png")},
  {type: TEXTURE, name: SPIKE, src: assets("dunkShot/spike.png")},
];
