import {Generator} from "./Generator";
import {Entity} from "@shared";
import {BOOSTER} from "../../entities/booster";

export class Booster extends Generator {
  generate() {
    const {eventBus} = this;

    const eBooster = new Entity({type: BOOSTER, eventBus}).init();

    this.prepareParent(eBooster, ...arguments);
    this.prepareView(eBooster, ...arguments);
    this.prepareBehaviour(eBooster, ...arguments);
    this.prepareMatrix(eBooster, ...arguments);
    this.prepareCollider(eBooster, ...arguments);
    this.prepareCombination(eBooster, ...arguments);

    return eBooster;
  }

  prepareParent(eBooster, {eParent}) {
    const {system} = this;

    const {cParent} = system.getBoosterInfo(eBooster);
    const {cChild} = system.getPlatformInfo(eParent);

    cParent.parentUUID = eParent.uuid;
    cChild.add(eBooster.uuid);
  }

  prepareView(eBooster, {texture, size: {width, height}}) {
    const {system} = this;

    const {cPixi, cMatrix} = system.getBoosterInfo(eBooster);

    const view = (cPixi.pixiObject = system.getAsset(eBooster, BOOSTER, {extraData: {textureName: texture}}));

    const scaleX = width / view.width;
    const scaleY = height / view.height;

    view.scale.x = cMatrix.scaleX = scaleX;
    view.scale.y = cMatrix.scaleY = scaleY;
  }

  prepareBehaviour(eBooster, {behaviour: {type, props}}) {
    const {system} = this;

    const {cBehaviour} = system.getBoosterInfo(eBooster);
    cBehaviour.group = type;
    cBehaviour.data = props;
  }

  prepareMatrix(
    eBooster,
    {
      eParent,
      behaviour: {
        props: {offset},
      },
    },
  ) {
    const {system} = this;

    const {cMatrix: cBoosterMatrix, view} = system.getBoosterInfo(eBooster);
    const {cMatrix: cParentMatrix} = system.getPlatformInfo(eParent);

    cBoosterMatrix.x = view.x = cParentMatrix.x + offset.x;
    cBoosterMatrix.y = view.y = cParentMatrix.y + offset.y;
  }

  prepareCollider(eBooster, {size: {width, height}, isTrackCollision}) {
    const {system} = this;
    const {cMatrix, cCollider} = system.getBoosterInfo(eBooster);
    cCollider.collider = system.createCollider(cMatrix.x, cMatrix.y, width, height);
    cCollider.isTrackCollision = isTrackCollision;
  }

  prepareCombination(eBooster, {combinationId}) {
    const {system} = this;
    const {cCombination} = system.getBoosterInfo(eBooster);
    cCombination.combinationId = combinationId;
  }
}
