import State from "../../../shared/scene/ecs/base/components/state/State";
import ThreeComponent from "../../../shared/scene/ecs/three/components/ThreeComponent";
import Collection from "../../../shared/scene/ecs/base/components/data/Collection";
import Body from "../../../shared/scene/ecs/rapier/components/Body";
import Matrix4Component from "../../../shared/scene/ecs/base/components/transform/Matrix4Component";
import GSAPTween from "../../../shared/scene/ecs/base/components/tween/GSAPTween";
import Game from "../controllers/components/Game";
import Mixer from "../../../shared/scene/ecs/three/components/Mixer";
import Orbit from "../controllers/components/Orbit";
import getDefaultState from "../../../shared/scene/lib/state/getDefaultState";
import {BASKETBALL_STATE_MACHINE} from "./stateMachine";
import {CHARACTER, states as characterStates} from "./character";
import {GROUND} from "./ground";
import {RING} from "./ring";
import {GAME} from "./game";
import {X2VIEW} from "./x2View";

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
      {Class: Matrix4Component},
      {Class: Body},
      {Class: Collection},
      {Class: GSAPTween}
    ]
  },
  [GROUND]: {
    components: [
      {Class: ThreeComponent},
      {Class: Matrix4Component},
      {Class: Body},
      {Class: Collection}
    ]
  },
  [RING]: {
    components: [
      {Class: ThreeComponent},
      {Class: Matrix4Component},
      {Class: Body},
      {Class: Collection},
      {Class: GSAPTween},
      {Class: Mixer}
    ]
  },
  [X2VIEW]: {
    components: [
      {Class: ThreeComponent},
      {Class: Matrix4Component},
      {Class: Collection},
      {Class: Orbit}
    ]
  }
};