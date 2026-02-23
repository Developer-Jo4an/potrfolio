import {CHARACTER} from "../entities/character";
import {MAIN_CONTAINER} from "../entities/mainContainer";
import {GAME_SIZE} from "../constants/game";
import {System, lerp, Entity} from "@shared";

export class Level extends System {
  initializationLevelSelect() {
    this.initMainContainer();
    this.initCharacter();
  }

  /**
   * mainContainer
   */
  initMainContainer() {
    const {
      storage: {eventBus, stage},
    } = this;

    new Entity({type: MAIN_CONTAINER, eventBus}).init();

    const {entity, cPixi} = this.getMainContainerInfo();
    const view = (cPixi.pixiObject = this.getAsset(entity, MAIN_CONTAINER));
    stage.addChild(view);
  }

  /**
   * character
   */
  initCharacter() {
    const {
      storage: {eventBus},
    } = this;

    new Entity({type: CHARACTER, eventBus}).init();

    const characterProps = this.getCharacterInfo();

    this.prepareCharacterView(characterProps);
    this.prepareCharacterMatrix(characterProps);
    this.prepareCharacterCollider(characterProps);
  }

  prepareCharacterMatrix({cMatrix, cPixi}) {
    const {
      distanceBetween,
      entities: [
        {
          size: {width},
          x,
        },
      ],
    } = this.getWiredCombination(1);
    const {view} = this.getCharacterInfo();

    cMatrix.x = view.x = lerp(width / 2, GAME_SIZE.width - width / 2, x);
    cMatrix.y = view.y = GAME_SIZE.height - distanceBetween - cPixi.pixiObject.height;
  }

  prepareCharacterView({
    entity,
    cMatrix,
    cPixi,
    settings: {
      size: {width, height},
    },
  }) {
    const {view: mainContainerView} = this.getMainContainerInfo();

    const view = (cPixi.pixiObject = this.getAsset(entity, CHARACTER));

    const scaleX = width / view.width;
    const scaleY = height / view.height;
    cMatrix.scaleX = view.scale.x = scaleX;
    cMatrix.scaleY = view.scale.y = scaleY;

    mainContainerView.addChild(view);
  }

  prepareCharacterCollider({cCollider, cMatrix, cPixi}) {
    const {width, height} = cPixi.pixiObject;
    cCollider.collider = this.createCollider(cMatrix.x, cMatrix.y, width, height);
  }
}
