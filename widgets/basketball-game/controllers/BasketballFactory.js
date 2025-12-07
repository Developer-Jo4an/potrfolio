import Factory from "../../../shared/scene/factory/Factory";
import {upperFirst} from "lodash";
import {assetsManager} from "../../../shared/scene/assets/AssetsManager";
import {GLTF, THREE_SPACE} from "../../../shared/scene/constants/loaders/assetsTypes";
import {CHARACTER, CHARACTER_VIEW_NAME} from "../entities/character";
import {SCENE_FROM_BLENDER} from "../constants/preload";
import {GROUND} from "../entities/ground";
import global from "../../../shared/constants/global/global";

export default class BasketballFactory extends Factory {
  static METHODS = {
    create: "create",
    prepare: "prepare",
    reset: "reset"
  };

  constructor(data) {
    super();
    this.defaultProperties = data;
  }

  static createMethod(key, type) {
    return `${key}${upperFirst(type)}`;
  }

  getItemByType(type, data) {
    return this[BasketballFactory.createMethod(BasketballFactory.METHODS.create, type)]?.(data);
  }

  getItem(type, data) {
    const storage = this.getStorage(type);
    let item = storage.pop();
    if (item)
      this[BasketballFactory.createMethod(BasketballFactory.METHODS.prepare, type)]?.(item, data);
    else
      item = this.createItem(type, data);
    return item;
  }

  pushItem(item) {
    const type = item._storageType ?? "unknown";
    const storage = this.getStorage(type);
    this[BasketballFactory.createMethod(BasketballFactory.METHODS.reset, type)]?.(item);
    storage.push(item);
  }

  /**
   * character
   */
  [`reset${upperFirst(CHARACTER)}`](characterSprite) {
  }

  [`prepare${upperFirst(CHARACTER)}`](characterSprite) {

  }

  [`create${upperFirst(CHARACTER)}`]() {
    const {
      defaultProperties: {
        storage: {
          mainSceneSettings: {
            character: {
              receiveShadow,
              castShadow,
              metalness,
              roughness,
              startData: {rotation}
            }
          }
        }
      }
    } = this;
    const {scene} = assetsManager.getAssetFromSpace(THREE_SPACE, GLTF, SCENE_FROM_BLENDER);
    const characterView = scene.getObjectByName(CHARACTER_VIEW_NAME);
    characterView.material.metalness = metalness;
    characterView.material.roughness = roughness;
    characterView.rotation.set(rotation.x, rotation.y, rotation.z);
    characterView.receiveShadow = receiveShadow;
    characterView.castShadow = castShadow;
    return characterView;
  }

  /**
   * ground
   */

  [`create${upperFirst(GROUND)}`]() {
    const {
      defaultProperties: {
        storage: {
          mainSceneSettings: {
            ground: {
              width,
              height,
              opacity,
              castShadow,
              rotation,
              receiveShadow
            }
          }
        }
      }
    } = this;

    const groundView = new global.THREE.Mesh(
      new global.THREE.PlaneGeometry(width, height),
      new global.THREE.ShadowMaterial({opacity})
    );
    groundView.rotation.set(rotation.x, rotation.y, rotation.z);
    groundView.name = GROUND;
    groundView.castShadow = castShadow;
    groundView.receiveShadow = receiveShadow;
    return groundView;
  }
}