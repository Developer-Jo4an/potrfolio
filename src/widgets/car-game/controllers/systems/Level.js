import {System, Entity, randFromArray} from "@shared";
import {ACTOR} from "../constants/actor";
import {MAIN_CONTAINER} from "../constants/mainContainer";
import {ROAD_CHUNKS_CONTAINER} from "../constants/roadChunkContainer";

export class Level extends System {
  initializationLevelSelect() {
    this.initMainContainer();
    this.initRoadChunksContainer();
    this.initActor();
    this.initStartAngle();
  }

  initMainContainer() {
    const {eventBus} = this;
    new Entity({eventBus, type: MAIN_CONTAINER}).init();
    this.initMainContainerView();
  }

  initMainContainerView() {
    const {
      storage: {stage},
    } = this;

    const {entity: eMainContainer, cPixi} = this.getMainContainerInfo();

    const asset = (cPixi.pixiObject = this.getAsset(eMainContainer, MAIN_CONTAINER));
    stage.addChild(asset);
  }

  initRoadChunksContainer() {
    const {eventBus} = this;
    new Entity({eventBus, type: ROAD_CHUNKS_CONTAINER}).init();
    this.initRoadChunksContainerView();
  }

  initRoadChunksContainerView() {
    const {entity: eRoadChunkContainer, cPixi} = this.getRoadChunksContainerInfo();

    const asset = (cPixi.pixiObject = this.getAsset(eRoadChunkContainer, ROAD_CHUNKS_CONTAINER));

    const {view: mainContainerView} = this.getMainContainerInfo();
    mainContainerView.addChild(asset);
  }

  initActor() {
    const {eventBus} = this;
    new Entity({eventBus, type: ACTOR}).init();
    this.initActorView();
    this.initActorCollider();
  }

  initActorView() {
    const {
      entity: eActor,
      cMatrix,
      cPixi,
      settings: {width, height, x, y},
    } = this.getActorInfo();

    const asset = (cPixi.pixiObject = this.getAsset(eActor, ACTOR));

    const scaleX = (cMatrix.scaleX = width / asset.width);
    const scaleY = (cMatrix.scaleY = height / asset.height);
    asset.scale.set(scaleX, scaleY);

    asset.x = cMatrix.x = x;
    asset.y = cMatrix.y = y;

    const {view: mainContainerView} = this.getMainContainerInfo();
    mainContainerView.addChild(asset);
  }

  initActorCollider() {
    const {cCollider, view: actorView} = this.getActorInfo();
    cCollider.collider = this.createCollider(actorView.x, actorView.y, actorView.width, actorView.height);
  }

  initStartAngle() {
    const {
      storage: {
        mainSceneSettings: {angle},
      },
    } = this;

    const {cMovement, cMatrix, view: characterView} = this.getActorInfo();

    cMovement.angle = cMatrix.rotation = characterView.rotation = randFromArray(angle);
  }
}
