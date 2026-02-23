import {Generator} from "./Generator";
import {HELPER} from "../../entities/helper";
import {Entity} from "@shared";

export class Helper extends Generator {
  generate() {
    const {eventBus} = this;

    const eHelper = new Entity({type: HELPER, eventBus}).init();

    this.prepareParent(eHelper, ...arguments);
    this.prepareView(eHelper, ...arguments);
    this.prepareBehaviour(eHelper, ...arguments);
    this.prepareMatrix(eHelper, ...arguments);
    this.prepareCollider(eHelper, ...arguments);
    this.prepareCombination(eHelper, ...arguments);

    return eHelper;
  }

  prepareParent(eHelper, {eParent}) {
    const {system} = this;

    const {cParent} = system.getHelperInfo(eHelper);
    const {cChild} = system.getPlatformInfo(eParent);

    cParent.parentUUID = eParent.uuid;
    cChild.add(eHelper.uuid);
  }

  prepareView(eHelper, {texture, size: {width, height}}) {
    const {system} = this;

    const {cPixi, cMatrix} = system.getHelperInfo(eHelper);

    const view = (cPixi.pixiObject = system.getAsset(eHelper, HELPER, {extraData: {name: texture}}));

    const scaleX = width / view.width;
    const scaleY = height / view.height;

    view.scale.x = cMatrix.scaleX = scaleX;
    view.scale.y = cMatrix.scaleY = scaleY;
  }

  prepareBehaviour(eHelper, {behaviour: {type, props}}) {
    const {system} = this;

    const {cBehaviour} = system.getHelperInfo(eHelper);
    cBehaviour.group = type;
    cBehaviour.data = props;
  }

  prepareMatrix(
    eHelper,
    {
      eParent,
      behaviour: {
        props: {offset}
      }
    }
  ) {
    const {system} = this;

    const {cMatrix: cHelperMatrix, view} = system.getHelperInfo(eHelper);
    const {cMatrix: cParentMatrix} = system.getPlatformInfo(eParent);

    cHelperMatrix.x = view.x = cParentMatrix.x + offset.x;
    cHelperMatrix.y = view.y = cParentMatrix.y + offset.y;
  }

  prepareCollider(eHelper, {size: {width, height}, isTrackCollision}) {
    const {system} = this;
    const {cMatrix, cCollider} = system.getHelperInfo(eHelper);
    cCollider.collider = system.createCollider(cMatrix.x, cMatrix.y, width, height);
    cCollider.isTrackCollision = isTrackCollision;
  }

  prepareCombination(eHelper, {combinationId}) {
    const {system} = this;
    const {cCombination} = system.getHelperInfo(eHelper);
    cCombination.combinationId = combinationId;
  }
}
