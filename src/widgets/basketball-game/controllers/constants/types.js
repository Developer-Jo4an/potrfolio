import {getDefaultState, Mixer, State, Collection, GSAPTween, Matrix4Component, Body, ThreeComponent} from "@shared";
import {Orbit} from "../components/Orbit";
import {Game} from "../components/Game";
import {STATE_MACHINE} from "./stateMachine";
import {CHARACTER, states as characterStates} from "./character";
import {GROUND} from "./ground";
import {RING} from "./ring";
import {GAME} from "./game";
import {X2VIEW} from "./x2View";

export const types = {
  [GAME]: {components: [{Class: State, props: {states: STATE_MACHINE}}, {Class: Game}]},
  [CHARACTER]: {
    components: [
      {Class: State, props: {states: characterStates, state: getDefaultState(characterStates)}},
      {Class: ThreeComponent},
      {Class: Matrix4Component},
      {Class: Body},
      {Class: Collection},
      {Class: GSAPTween},
    ],
  },
  [GROUND]: {components: [{Class: ThreeComponent}, {Class: Matrix4Component}, {Class: Body}, {Class: Collection}]},
  [RING]: {
    components: [
      {Class: ThreeComponent},
      {Class: Matrix4Component},
      {Class: Body},
      {Class: Collection},
      {Class: GSAPTween},
      {Class: Mixer},
    ],
  },
  [X2VIEW]: {
    components: [
      {Class: ThreeComponent},
      {Class: Matrix4Component},
      {Class: Collection},
      {Class: GSAPTween},
      {Class: Orbit},
    ],
  },
};
