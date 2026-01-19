import {Chunk} from "../../controllers/components/Chunk";
import {Game} from "../../controllers/components/Game";
import {CHARACTER, states as characterStates} from "./character";
import {GAME} from "./game";
import {MAIN_CONTAINER} from "./mainContainer";
import {ROAD_CHUNK} from "./roadChunk";
import {BONUS} from "./bonus";
import {SPIKE} from "./spike";
import {CAR_STATE_MACHINE} from "../stateMachine";
import {ROAD_CHUNKS_CONTAINER} from "./roadChunksContainer";
import {getDefaultState, Collider, Matrix3Component, PixiComponent} from "@shared";
import {State} from "@/shared/scene/src/ecs/base/components/state/State"; //TODO: поправить импорт
import {Collection} from "@/shared/scene/src/ecs/base/components/data/Collection"; //TODO: поправить импорт

export const types = {
  [GAME]: {
    components: [
      {Class: State, props: {states: CAR_STATE_MACHINE}},
      {Class: Game}
    ]
  },
  [CHARACTER]: {
    components: [
      {Class: PixiComponent},
      {Class: Matrix3Component},
      {Class: State, props: {states: characterStates, state: getDefaultState(characterStates)}},
      {Class: Collection},
      {Class: Collider}
    ]
  },
  [MAIN_CONTAINER]: {
    components: [
      {Class: PixiComponent},
      {Class: Matrix3Component},
      {Class: Collection}
    ]
  },
  [ROAD_CHUNKS_CONTAINER]: {
    components: [
      {Class: PixiComponent},
      {Class: Matrix3Component},
      {Class: Collection}
    ]
  },
  [ROAD_CHUNK]: {
    components: [
      {Class: PixiComponent},
      {Class: Chunk},
      {Class: Collection},
      {Class: Matrix3Component},
      {Class: Collider}
    ]
  },
  [BONUS]: {
    components: [
      {Class: PixiComponent},
      {Class: Collection},
      {Class: Matrix3Component},
      {Class: Collider}
    ]
  },
  [SPIKE]: {
    components: [
      {Class: PixiComponent},
      {Class: Collection},
      {Class: Matrix3Component},
      {Class: Collider}
    ]
  }
};
