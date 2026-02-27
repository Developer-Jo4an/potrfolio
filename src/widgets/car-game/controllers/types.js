import {Game} from "./components/Game";
import {ACTOR} from "./constants/actor";
import {STATE_MACHINE} from "./constants/stateMachine";
import {CollisionGroups} from "./constants/collision";
import {MAIN_CONTAINER} from "./constants/mainContainer";
import {ROAD_CHUNKS_CONTAINER} from "./constants/roadChunkContainer";
import {ROAD_CHUNK} from "./constants/entities";
import {
  Collection,
  Matrix3Component,
  Tween,
  Promise as CPromise,
  PixiComponent,
  SatCollider,
  State,
  PixiDebug,
  CollisionConfig,
  COLLISION_CONFIG,
} from "@shared";
import {Polygon} from "./components/Polygon";

export const types = {
  game: {
    components: [{Class: Game}, {Class: State, props: {states: STATE_MACHINE}}],
  },
  [MAIN_CONTAINER]: {
    components: [{Class: Collection}, {Class: PixiComponent}, {Class: Matrix3Component}],
  },
  [ROAD_CHUNKS_CONTAINER]: {
    components: [{Class: Collection}, {Class: PixiComponent}, {Class: Matrix3Component}],
  },
  [ACTOR]: {
    components: [
      {Class: PixiComponent},
      {Class: Matrix3Component},
      {Class: SatCollider, props: {group: CollisionGroups.ACTOR, isTrackCollision: true}},
      {Class: PixiDebug, props: {strokeSettings: {width: 2, color: 0x00ff00}}},
      {Class: Collection},
      {Class: CPromise},
      {Class: Tween},
    ],
  },
  [ROAD_CHUNK]: {
    components: [
      {Class: PixiComponent},
      {Class: Matrix3Component},
      {Class: SatCollider, props: {group: CollisionGroups.ACTOR, isTrackCollision: true}},
      {Class: PixiDebug, props: {strokeSettings: {width: 2, color: 0xff0000}}},
      {Class: Collection},
      {Class: Polygon},
    ],
  },
  [COLLISION_CONFIG]: {
    components: [{Class: CollisionConfig, props: {collisionConfig: {}}}],
  },
};
