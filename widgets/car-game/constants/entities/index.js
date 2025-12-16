import Collider from "../../../../shared/scene/ecs/base/components/collision/Collider";
import State from "../../../../shared/scene/ecs/base/components/state/State";
import Matrix3Component from "../../../../shared/scene/ecs/base/components/transform/Matrix3Component";
import Collection from "../../../../shared/scene/ecs/base/components/data/Collection";
import PixiComponent from "../../../../shared/scene/ecs/pixi/components/PixiComponent";
import Chunk from "../../controllers/components/Chunk";
import Game from "../../controllers/components/Game";
import getDefaultState from "../../../../shared/scene/lib/state/getDefaultState";
import {CHARACTER, states as characterStates} from "./character";
import {GAME} from "./game";
import {MAIN_CONTAINER} from "./mainContainer";
import {ROAD_CHUNK} from "./roadChunk";
import {BONUS} from "./bonus";
import {SPIKE} from "./spike";
import {CAR_STATE_MACHINE} from "../stateMachine";
import {ROAD_CHUNKS_CONTAINER} from "./roadChunksContainer";

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
