import Factory from "../../../shared/scene/factory/Factory";
import ThreeComponent from "../../../shared/scene/ecs/three/components/ThreeComponent";
import {upperFirst} from "lodash";
import {assetsManager} from "../../../shared/scene/assets/AssetsManager";
import {GLTF, THREE_SPACE} from "../../../shared/scene/constants/loaders/assetsTypes";
import {CHARACTER, CHARACTER_BODY, CHARACTER_VIEW_NAME} from "../entities/character";
import {SCENE_FROM_BLENDER} from "../constants/preload";
import {GROUND, GROUND_BODY} from "../entities/ground";
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
              startData: {rotation, position}
            }
          }
        }
      }
    } = this;
    const {scene} = assetsManager.getAssetFromSpace(THREE_SPACE, GLTF, SCENE_FROM_BLENDER);
    const characterView = scene.getObjectByName(CHARACTER_VIEW_NAME);
    characterView.material.metalness = metalness;
    characterView.material.roughness = roughness;
    characterView.position.copy(position);
    characterView.rotation.set(rotation.x, rotation.y, rotation.z);
    characterView.receiveShadow = receiveShadow;
    characterView.castShadow = castShadow;
    return characterView;
  }

  [`create${upperFirst(CHARACTER_BODY)}`]({entity}) {
    const {defaultProperties: {storage: {world}}} = this;
    const characterView = entity.get(ThreeComponent).threeObject;
    const {position, rotation} = characterView;
    const characterBodyDesc = global.RAPIER3D.RigidBodyDesc.dynamic();
    characterBodyDesc
    .setTranslation(position.x, position.y, position.z)
    .setRotation(new global.THREE.Quaternion().setFromEuler(rotation));
    const characterBody = world.createRigidBody(characterBodyDesc);
    const characterGeometry = characterView.geometry;
    const characterVertices = Array.from(characterGeometry.attributes.position.array);
    const characterIndexes = Array.from(characterGeometry.index.array);
    const characterColliderDesc = global.RAPIER3D.ColliderDesc.trimesh(characterVertices, characterIndexes);
    world.createCollider(characterColliderDesc, characterBody);
    return characterBody;
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
              depth,
              opacity,
              castShadow,
              receiveShadow
            }
          }
        }
      }
    } = this;

    const groundView = new global.THREE.Mesh(
      new global.THREE.BoxGeometry(width, height, depth),
      new global.THREE.ShadowMaterial({opacity})
    );
    groundView.name = GROUND;
    groundView.castShadow = castShadow;
    groundView.receiveShadow = receiveShadow;
    return groundView;
  }

  [`create${upperFirst(GROUND_BODY)}`]({entity}) {
    const {defaultProperties: {storage: {world}}} = this;
    const groundView = entity.get(ThreeComponent).threeObject;
    const {position, rotation} = groundView;
    const groundBodyDesc = global.RAPIER3D.RigidBodyDesc.fixed();
    groundBodyDesc
    .setTranslation(position.x, position.y, position.z)
    .setRotation(new global.THREE.Quaternion().setFromEuler(rotation));
    const groundBody = world.createRigidBody(groundBodyDesc);
    const groundGeometry = groundView.geometry;
    const groundVertices = Array.from(groundGeometry.attributes.position.array);
    const groundIndexes = Array.from(groundGeometry.index.array);
    const groundColliderDesc = global.RAPIER3D.ColliderDesc.trimesh(groundVertices, groundIndexes);
    world.createCollider(groundColliderDesc, groundBody);
    return groundBody;
  }
}