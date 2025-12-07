import State from "../../../shared/scene/ecs/base/components/state/State";
import Game from "../../car-game/controllers/components/Game";
import ThreeComponent from "../../../shared/scene/ecs/three/components/ThreeComponent";
import Collection from "../../../shared/scene/ecs/base/components/data/Collection";
import getDefaultState from "../../../shared/scene/lib/state/getDefaultState";
import {BASKETBALL_STATE_MACHINE} from "./stateMachine";
import {GAME} from "../../car-game/constants/entities/game";
import {CHARACTER, states as characterStates} from "../entities/character";
import {GROUND} from "../entities/ground";

export const types = {
  [GAME]: {
    components: [
      {Class: State, props: {states: BASKETBALL_STATE_MACHINE}},
      {Class: Game}
    ]
  },
  [CHARACTER]: {
    components: [
      {Class: State, props: {states: characterStates, state: getDefaultState(characterStates)}},
      {Class: ThreeComponent},
      {Class: Collection}
    ]
  },
  [GROUND]: {
    components: [
      {Class: ThreeComponent},
      {Class: Collection}
    ]
  }
};