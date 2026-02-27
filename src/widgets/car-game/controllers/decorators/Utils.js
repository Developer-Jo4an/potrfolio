import {Decorator, State, Matrix3Component, Tween, PixiComponent, SatCollider} from "@shared";
import {Game} from "../components/Game";
import {upperFirst} from "lodash";
import {GAME} from "../constants/game";
import {ACTOR} from "../constants/actor";
import {MAIN_CONTAINER} from "../constants/mainContainer";
import {ROAD_CHUNKS_CONTAINER} from "../constants/roadChunkContainer";

export class Utils extends Decorator {
  /**
   * shortcuts
   */
  getInfo(entity) {
    const {
      storage: {mainSceneSettings},
    } = this;

    return entity.children.reduce(
      (acc, child) => {
        switch (child.constructor) {
          case PixiComponent: {
            acc.cPixi = child;
            const {pixiObject: view} = child;
            acc.view = view;
            return acc;
          }

          case SatCollider: {
            acc.cCollider = child;
            const {collider, response} = child;
            acc.collider = collider;
            acc.response = response;
            return acc;
          }

          case Matrix3Component: {
            acc.cMatrix = child;
            return acc;
          }

          case State: {
            acc.cState = child;
            const {state} = child;
            acc.state = state;
            return acc;
          }

          case Game: {
            acc.cGame = child;
            return acc;
          }

          default: {
            const field = `c${upperFirst(child.type)}`;
            acc[field] = child;
            return acc;
          }
        }
      },
      {entity, settings: mainSceneSettings[entity.type]},
    );
  }

  getActorInfo() {
    const eActor = this.getFirstEntityByType(ACTOR);
    return this.getInfo(eActor);
  }

  getMainContainerInfo() {
    const eMainContainer = this.getFirstEntityByType(MAIN_CONTAINER);
    return this.getInfo(eMainContainer);
  }

  getRoadChunksContainerInfo() {
    const eRoadChunksContainer = this.getFirstEntityByType(ROAD_CHUNKS_CONTAINER);
    return this.getInfo(eRoadChunksContainer);
  }

  getGameInfo() {
    const eGame = this.getFirstEntityByType("game");
    return this.getInfo(eGame);
  }

  getRoadChunkInfo(eRoadChunk) {
    return this.getInfo(eRoadChunk);
  }

  /**
   * other
   */
  destroyEntity(entity) {
    if (!entity) return;

    const cTween = entity.get(Tween);
    cTween && this.clearAllTweens(cTween);

    entity.destroy();
  }

  clearAllTweens(cTween) {
    const {tweens} = cTween;
    for (const tween of tweens.values()) tween.delete(GAME);
    cTween.removeAll();
  }
}
