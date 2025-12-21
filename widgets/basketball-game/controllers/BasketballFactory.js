import Factory from "../../../shared/scene/factory/Factory";
import ThreeComponent from "../../../shared/scene/ecs/three/components/ThreeComponent";
import {upperFirst} from "lodash";
import {assetsManager} from "../../../shared/scene/assets/AssetsManager";
import {GLTF, THREE_SPACE} from "../../../shared/scene/constants/loaders/assetsTypes";
import {CHARACTER, CHARACTER_BODY, CHARACTER_VIEW_NAME} from "../entities/character";
import {SCENE_FROM_BLENDER} from "../constants/preload";
import {GROUND, GROUND_BODY} from "../entities/ground";

export default class BasketballFactory extends Factory {
  static METHODS = {
    create: "create",
    prepare: "prepare",
    reset: "reset"
  };

  constructor(data) {
    super(...arguments);
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
    const {scene} = assetsManager.getAssetFromSpace(THREE_SPACE, GLTF, SCENE_FROM_BLENDER);
    return scene.getObjectByName(CHARACTER_VIEW_NAME);
  }

  [`create${upperFirst(CHARACTER_BODY)}`]({radius}) {
    const {defaultProperties: {storage: {world}}} = this;
    const characterBodyDesc = RAPIER3D.RigidBodyDesc.dynamic();
    const characterBody = world.createRigidBody(characterBodyDesc);
    const characterColliderDesc = RAPIER3D.ColliderDesc.ball(radius);
    characterBody.collider = world.createCollider(characterColliderDesc, characterBody);
    return characterBody;
  }

  /**
   * ground
   */
  [`create${upperFirst(GROUND)}`]() {
    const {defaultProperties: {storage: {mainSceneSettings: {ground: {width, height, depth, opacity}}}}} = this;

    return new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.ShadowMaterial({opacity})
    );
  }

  [`create${upperFirst(GROUND_BODY)}`]({vertices, indexes}) {
    const {defaultProperties: {storage: {world}}} = this;
    const groundBodyDesc = RAPIER3D.RigidBodyDesc.fixed();
    const groundBody = world.createRigidBody(groundBodyDesc);
    const groundColliderDesc = RAPIER3D.ColliderDesc.trimesh(vertices, indexes);
    groundBody.collider = world.createCollider(groundColliderDesc, groundBody);
    return groundBody;
  }
}