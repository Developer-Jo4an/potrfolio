import Factory from "../../../shared/scene/factory/Factory";
import ThreeComponent from "../../../shared/scene/ecs/three/components/ThreeComponent";
import {upperFirst} from "lodash";
import {assetsManager} from "../../../shared/scene/assets/AssetsManager";
import {GLTF, THREE_SPACE} from "../../../shared/scene/constants/loaders/assetsTypes";
import {CHARACTER, CHARACTER_BODY, CHARACTER_VIEW_NAME} from "../entities/character";
import {SCENE_FROM_BLENDER} from "../constants/preload";
import {GROUND, GROUND_BODY} from "../entities/ground";
import {RING, RING_BODY, RING_GRID_VIEW_NAME, RING_SHIELD_VIEW_NAME, RING_VIEW_NAME} from "../entities/ring";

const METHODS = {
  create: "create",
  prepare: "prepare",
  reset: "reset"
};

export default class BasketballFactory extends Factory {
  constructor(data) {
    super(...arguments);
    this.defaultProperties = data;
  }

  getItemByType(type, data) {
    return this[createMethod(METHODS.create, type)]?.(data);
  }

  getItem(type, data) {
    const storage = this.getStorage(type);
    let item = storage.pop();
    if (item)
      this[createMethod(METHODS.prepare, type)]?.(item, data);
    else
      item = this.createItem(type, data);
    return item;
  }

  pushItem(item) {
    const type = item._storageType ?? "unknown";
    const storage = this.getStorage(type);
    this[createMethod(METHODS.reset, type)]?.(item);
    storage.push(item);
  }

  /**
   * character
   */
  [createMethod(METHODS.reset, CHARACTER)](characterSprite) {
  }

  [createMethod(METHODS.prepare, CHARACTER)](characterSprite) {

  }

  [createMethod(METHODS.create, CHARACTER)]() {
    const {scene} = assetsManager.getAssetFromSpace(THREE_SPACE, GLTF, SCENE_FROM_BLENDER);
    return scene.getObjectByName(CHARACTER_VIEW_NAME);
  }

  [createMethod(METHODS.create, CHARACTER_BODY)]({radius}) {
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
  [createMethod(METHODS.create, GROUND)]() {
    const {defaultProperties: {storage: {mainSceneSettings: {ground: {width, height, depth, opacity}}}}} = this;

    return new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.ShadowMaterial({opacity})
    );
  }

  [createMethod(METHODS.create, GROUND_BODY)]({vertices, indexes}) {
    const {defaultProperties: {storage: {world}}} = this;
    const groundBodyDesc = RAPIER3D.RigidBodyDesc.fixed();
    const groundBody = world.createRigidBody(groundBodyDesc);
    const groundColliderDesc = RAPIER3D.ColliderDesc.trimesh(vertices, indexes);
    groundBody.collider = world.createCollider(groundColliderDesc, groundBody);
    return groundBody;
  }

  /**
   * ring
   */
  [createMethod(METHODS.create, RING)]() {
    const {scene} = assetsManager.getAssetFromSpace(THREE_SPACE, GLTF, SCENE_FROM_BLENDER);

    const ring = scene.getObjectByName(RING_VIEW_NAME);
    const shield = scene.getObjectByName(RING_SHIELD_VIEW_NAME);
    const grid = scene.getObjectByName(RING_GRID_VIEW_NAME);

    const ringContainer = new THREE.Group();
    ringContainer.add(ring);
    ringContainer.add(shield);
    ringContainer.add(grid);

    return ringContainer;
  }

  [createMethod(METHODS.create, RING_BODY)]({ring, shield, grid}) {
    const {defaultProperties: {storage: {world}}} = this;
    const ringBodyDesc = RAPIER3D.RigidBodyDesc.fixed();
    const ringBody = world.createRigidBody(ringBodyDesc);

    const ringColliderDesc = RAPIER3D.ColliderDesc.trimesh(ring.vertices, ring.indexes);
    const shieldColliderDesc = RAPIER3D.ColliderDesc.trimesh(shield.vertices, shield.indexes);
    const gridColliderDesc = RAPIER3D.ColliderDesc.trimesh(grid.vertices, grid.indexes);

    ringBody.collider = {
      ring: world.createCollider(ringColliderDesc, ringBody),
      shield: world.createCollider(shieldColliderDesc, ringBody),
      grid: world.createCollider(gridColliderDesc, ringBody)
    };

    return ringBody;
  }
}

function createMethod(key, type) {
  return `${key}${upperFirst(type)}`;
}