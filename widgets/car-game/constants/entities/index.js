import SatCollider from "../../controllers/components/SatCollider";
import State from "../../../../shared/scene/ecs/base/components/state/State";
import Matrix3Component from "../../../../shared/scene/ecs/base/components/transform/Matrix3Component";
import Collection from "../../../../shared/scene/ecs/base/components/data/Collection";
import PixiComponent from "../../../../shared/scene/ecs/pixi/components/PixiComponent";
import Chunk from "../../controllers/components/Chunk";
import Game from "../../controllers/components/Game";
import getDefaultState from "../../../../shared/scene/lib/state/getDefaultState";
import {CHARACTER, states as characterStates} from "./character";
import {SIDE_EFFECTS} from "../components/collections/groups";
import {GAME} from "./game";
import {MAIN_CONTAINER} from "./mainContainer";
import {ROAD_CHUNK} from "./roadChunk";
import {BONUS} from "./bonus";
import {SPIKE} from "./spike";
import {CAR_STATE_MACHINE} from "../stateMachine";

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
      {Class: Collection, props: {group: SIDE_EFFECTS}},
      {Class: SatCollider}
    ]
  },
  [MAIN_CONTAINER]: {
    components: [
      {Class: PixiComponent},
      {Class: Matrix3Component},
      {Class: Collection, props: {group: SIDE_EFFECTS}}
    ]
  },
  [ROAD_CHUNK]: {
    components: [
      {Class: PixiComponent},
      {Class: Chunk},
      {Class: Collection, props: {group: SIDE_EFFECTS}},
      {Class: Matrix3Component},
      {Class: SatCollider},
    ]
  },
  [BONUS]: {
    components: [
      {Class: PixiComponent},
      {Class: Collection, props: {group: SIDE_EFFECTS}},
      {Class: Matrix3Component},
      {Class: SatCollider}
    ]
  },
  [SPIKE]: {
    components: [
      {Class: PixiComponent},
      {Class: Collection, props: {group: SIDE_EFFECTS}},
      {Class: Matrix3Component},
      {Class: SatCollider}
    ]
  }
};
