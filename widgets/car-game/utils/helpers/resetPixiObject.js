import {isNumber} from "lodash";

export default function resetPixiObject(object) {
  object.position.set(0);
  object.scale.set(1);
  object.skew.set(0);
  object.rotation = 0;
  object.pivot.set(0);
  object.zIndex = 0;
  object.removeChildren();
  object.anchor && object.anchor.set(0);
  object.tilePosition && object.tilePosition.set(0);
  object.tileScale && object.tileScale.set(1);
  isNumber(object.tileRotation) && (object.tileRotation = 0);
  object.texture && (object.texture = null);
  object.label = null;
  object.visible = true;
  if (object.mask) {
    object.mask.clear();
    object.mask.parent?.removeChild(object.mask);
    object.mask.label = null;
  }
  object.parent && object.parent.removeChild(object);
}

