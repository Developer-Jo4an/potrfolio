import {Game} from "../components/Game";
import {Tree} from "../components/Tree";
import {Cell} from "../components/Cell";
import {Queue} from "../components/Queue";
import {Booster} from "../components/Booster";
import {Bounds} from "../components/Bounds";
import {Timer} from "../components/Timer";
import {Collection, Matrix3Component, PixiComponent, State, Promise, Tween} from "@shared";
import {STATE_MACHINE} from "../constants/stateMachine";
import {TREE} from "./tree";
import {CELL} from "./cell";
import {SHELF} from "./shelf";
import {BOOSTER} from "./booster";
import {ANIMATION_TREE} from "./animationTree";
import {BOUNDS} from "./bounds";
import {TIMER} from "./timer";

export const types = {
  game: {
    components: [{Class: State, props: {states: STATE_MACHINE}}, {Class: Game}],
  },
  [TREE]: {
    components: [{Class: Tree}, {Class: PixiComponent}, {Class: Matrix3Component}, {Class: Collection}],
  },
  [CELL]: {
    components: [
      {Class: Promise},
      {Class: PixiComponent},
      {Class: Matrix3Component},
      {Class: Collection},
      {Class: Cell},
      {Class: Tween},
    ],
  },
  [SHELF]: {
    components: [{Class: PixiComponent}, {Class: Queue}, {Class: Matrix3Component}, {Class: Collection}],
  },
  [BOOSTER]: {
    components: [{Class: Booster}, {Class: Tween}, {Class: Promise}, {Class: Collection}],
  },
  [ANIMATION_TREE]: {
    components: [{Class: Queue}, {Class: Collection}],
  },
  [BOUNDS]: {
    components: [{Class: Bounds}, {Class: Collection}],
  },
  [TIMER]: {
    components: [{Class: Timer}, {Class: Collection}],
  },
};
