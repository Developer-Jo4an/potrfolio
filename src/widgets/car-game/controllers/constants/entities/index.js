import {Chunk} from "../../components/Chunk";
import {Game} from "../../components/Game";
import {CHARACTER, states as characterStates} from "./character";
import {GAME} from "./game";
import {MAIN_CONTAINER} from "./mainContainer";
import {ROAD_CHUNK} from "./roadChunk";
import {BONUS} from "./bonus";
import {BLOCK} from "./block";
import {STATE_MACHINE} from "../stateMachine";
import {ROAD_CHUNKS_CONTAINER} from "./roadChunksContainer";
import {getDefaultState, Collider, State, Collection, Matrix3Component, PixiComponent} from "@shared";

export const types = {
  [GAME]: {components: [{Class: State, props: {states: STATE_MACHINE}}, {Class: Game}]},
  [CHARACTER]: {
    components: [
      {Class: PixiComponent},
      {Class: Matrix3Component},
      {Class: State, props: {states: characterStates, state: getDefaultState(characterStates)}},
      {Class: Collection},
      {Class: Collider},
    ],
  },
  [MAIN_CONTAINER]: {components: [{Class: PixiComponent}, {Class: Matrix3Component}, {Class: Collection}]},
  [ROAD_CHUNKS_CONTAINER]: {components: [{Class: PixiComponent}, {Class: Matrix3Component}, {Class: Collection}]},
  [ROAD_CHUNK]: {
    components: [
      {Class: PixiComponent},
      {Class: Chunk},
      {Class: Collection},
      {Class: Matrix3Component},
      {Class: Collider},
    ],
  },
  [BONUS]: {components: [{Class: PixiComponent}, {Class: Collection}, {Class: Matrix3Component}, {Class: Collider}]},
  [BLOCK]: {components: [{Class: PixiComponent}, {Class: Collection}, {Class: Matrix3Component}, {Class: Collider}]},
};
