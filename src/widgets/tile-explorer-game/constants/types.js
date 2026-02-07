import {Collection, GSAPTween, Matrix3Component, PixiComponent, State} from "@shared";
import {Game} from "../controllers/components/Game";
import {AbstractTree} from "../controllers/components/AbstractTree";
import {Cell} from "../controllers/components/Cell";
import {STATE_MACHINE} from "./stateMachine";
import {ABSTRACT_TREE} from "../controllers/entities/AbstractTree";
import {CELL} from "../controllers/entities/Cell";

export const types = {
  game: {
    components: [{Class: State, props: {states: STATE_MACHINE}}, {Class: Game}]
  },
  [ABSTRACT_TREE]: {
    components: [{Class: AbstractTree}, {Class: PixiComponent}, {Class: Matrix3Component}, {Class: Collection}]
  },
  [CELL]: {
    components: [
      {Class: PixiComponent},
      {Class: Matrix3Component},
      {Class: Collection},
      {Class: GSAPTween},
      {Class: Cell}
    ]
  }
};
