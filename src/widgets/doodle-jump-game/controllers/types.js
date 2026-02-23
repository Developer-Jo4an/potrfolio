import {Game} from "./components/Game";
import {Counter} from "./components/Counter";
import {Parent} from "./components/Parent";
import {Complexity} from "./components/Complexity";
import {Physics} from "./components/Physics";
import {Input} from "./components/Input";
import {VectorRoad} from "./components/VectorRoad";
import {Child} from "./components/Child";
import {Combination} from "./components/Combination";
import {Behaviour} from "./components/Behaviour";
import {Target} from "./components/Target";
import {Booster} from "./components/Booster";
import {Helper} from "./components/Helper";
import {Immunity} from "./components/Immunity";
import {CHARACTER} from "./entities/character";
import {PLATFORM} from "./entities/platform";
import {ENEMY} from "./entities/enemy";
import {BOOSTER} from "./entities/booster";
import {complexity} from "./config/complexity";
import {MAIN_CONTAINER} from "./entities/mainContainer";
import {BULLET} from "./entities/bullet";
import {collisionConfig, CollisionGroups} from "./config/collision";
import {HELPER} from "./entities/helper";
import {STATE_MACHINE} from "./constants/stateMachine";
import {
  Collection,
  Matrix3Component,
  SatCollider,
  State,
  Tween,
  Promise as CPromise,
  CollisionConfig,
  PixiComponent,
  PixiDebugComponent,
  COLLISION_CONFIG
} from "@shared";

export const types = {
  game: {
    components: [
      {Class: State, props: {states: STATE_MACHINE}},
      {Class: Game},
      {Class: Complexity, props: {config: complexity, current: 0}}
    ]
  },
  [MAIN_CONTAINER]: {
    components: [
      {Class: Collection},
      {Class: PixiComponent},
      {Class: Matrix3Component}
    ]
  },
  [CHARACTER]: {
    components: [
      {Class: Collection},
      {Class: Physics, props: {accelerationY: 2440, accelerationX: 7000}},
      {Class: PixiComponent},
      {Class: Booster},
      {Class: Helper},
      {Class: VectorRoad},
      {Class: Immunity},
      {Class: Matrix3Component},
      {Class: PixiDebugComponent, props: {strokeSettings: {width: 2, color: 0x00ff00}}},
      {Class: Input},
      {Class: Tween},
      {Class: CPromise},
      {Class: SatCollider, props: {group: CollisionGroups.CHARACTER, isTrackCollision: true}}
    ]
  },
  [PLATFORM]: {
    components: [
      {Class: Collection},
      {Class: PixiComponent},
      {Class: Matrix3Component},
      {Class: Combination},
      {Class: SatCollider, props: {group: CollisionGroups.PLATFORM, isTrackCollision: true}},
      {Class: Counter, props: {max: 8}},
      {Class: Child},
      {Class: PixiDebugComponent, props: {strokeSettings: {width: 2, color: 0x0000ff}}},
      {Class: Tween},
      {Class: CPromise}
    ]
  },
  [ENEMY]: {
    components: [
      {Class: Collection},
      {Class: PixiComponent},
      {Class: Matrix3Component},
      {Class: Combination},
      {Class: Behaviour},
      {Class: Counter, props: {max: 1}},
      {Class: SatCollider, props: {group: CollisionGroups.ENEMY, isTrackCollision: true}},
      {Class: PixiDebugComponent, props: {strokeSettings: {width: 2, color: 0xff0000}}},
      {Class: Parent},
      {Class: Tween},
      {Class: CPromise}
    ]
  },
  [BOOSTER]: {
    components: [
      {Class: Collection},
      {Class: PixiComponent},
      {Class: Matrix3Component},
      {Class: Combination},
      {Class: Parent},
      {Class: Behaviour},
      {Class: PixiDebugComponent, props: {strokeSettings: {width: 2, color: 0xb806f4}}},
      {Class: SatCollider, props: {group: CollisionGroups.BOOSTER, isTrackCollision: true}}
    ]
  },
  [HELPER]: {
    components: [
      {Class: Collection},
      {Class: PixiComponent},
      {Class: Matrix3Component},
      {Class: Combination},
      {Class: Parent},
      {Class: Behaviour},
      {Class: PixiDebugComponent, props: {strokeSettings: {width: 2, color: 0xf80297}}},
      {Class: SatCollider, props: {group: CollisionGroups.HELPER, isTrackCollision: true}}
    ]
  },
  [BULLET]: {
    components: [
      {Class: Collection},
      {Class: PixiComponent},
      {Class: Matrix3Component},
      {Class: PixiDebugComponent, props: {strokeSettings: {width: 1, color: 0x050505}}},
      {Class: SatCollider, props: {group: CollisionGroups.BULLET, isTrackCollision: true}},
      {Class: Target}
    ]
  },
  [COLLISION_CONFIG]: {
    components: [{Class: CollisionConfig, props: {collisionConfig}}]
  }
};
