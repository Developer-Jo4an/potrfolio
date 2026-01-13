import Factory from "../../../shared/scene/factory/Factory";
import {upperFirst} from "lodash";
import {assetsManager} from "../../../shared/scene/assets/AssetsManager";
import {GLTF, THREE_SPACE} from "../../../shared/scene/constants/loaders/assetsTypes";
import {CHARACTER, CHARACTER_BODY, CHARACTER_VIEW_NAME} from "../constants/character";
import {SCENE_FROM_BLENDER} from "../constants/preload";
import {GROUND, GROUND_BODY} from "../constants/ground";
import {
  RING,
  RING_BODY,
  RING_GRID,
  RING_GRID_VIEW_NAME,
  RING_SHIELD,
  RING_SHIELD_VIEW_NAME,
  RING_VIEW_NAME,
  SENSOR
} from "../constants/ring";
import {X2VIEW} from "../constants/x2View";

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
   * character view
   */
  [createMethod(METHODS.create, CHARACTER)]() {
    const {scene} = assetsManager.getAssetFromSpace(THREE_SPACE, GLTF, SCENE_FROM_BLENDER);
    return scene.getObjectByName(CHARACTER_VIEW_NAME);
  }

  /**
   * character body
   */
  [createMethod(METHODS.create, CHARACTER_BODY)]({radius}) {
    const {defaultProperties: {storage: {world}}} = this;
    const characterBodyDesc = RAPIER3D.RigidBodyDesc.dynamic();
    const characterBody = world.createRigidBody(characterBodyDesc);
    const characterColliderDesc = RAPIER3D.ColliderDesc.ball(radius);
    const characterCollider = world.createCollider(characterColliderDesc, characterBody);
    characterCollider.userData = {id: CHARACTER};
    characterBody.collider = characterCollider;
    return characterBody;
  }

  /**
   * ground view
   */
  [createMethod(METHODS.create, GROUND)]() {
    const {defaultProperties: {storage: {mainSceneSettings: {ground: {width, height, depth, opacity}}}}} = this;

    return new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.ShadowMaterial({opacity})
    );
  }

  /**
   * ground body
   */
  [createMethod(METHODS.create, GROUND_BODY)]({vertices, indexes}) {
    const {defaultProperties: {storage: {world}}} = this;
    const groundBodyDesc = RAPIER3D.RigidBodyDesc.fixed();
    const groundBody = world.createRigidBody(groundBodyDesc);
    const groundColliderDesc = RAPIER3D.ColliderDesc.trimesh(vertices, indexes);
    const groundCollider = world.createCollider(groundColliderDesc, groundBody);
    groundCollider.userData = {id: GROUND};
    groundBody.collider = groundCollider;
    return groundBody;
  }

  /**
   * ring view
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

  /**
   * ring body
   */
  [createMethod(METHODS.create, RING_BODY)]({ring, shield, grid, sensor}) {
    const {defaultProperties: {storage: {world}}} = this;
    const ringBodyDesc = RAPIER3D.RigidBodyDesc.fixed();
    const ringBody = world.createRigidBody(ringBodyDesc);

    const ringColliderDesc = RAPIER3D.ColliderDesc.trimesh(ring.vertices, ring.indexes);
    ringColliderDesc.setRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler(
      ring.extraProps.rotation.x,
      ring.extraProps.rotation.y,
      ring.extraProps.rotation.z
    )));
    const ringCollider = world.createCollider(ringColliderDesc, ringBody);
    ringCollider.userData = {id: RING};

    const sensorColliderDesc = RAPIER3D.ColliderDesc.ball(sensor.radius);
    sensorColliderDesc.setSensor(true);
    sensorColliderDesc.setTranslation(...sensor.translation);
    const sensorCollider = world.createCollider(sensorColliderDesc, ringBody);
    sensorCollider.userData = {id: SENSOR};

    const shieldColliderDesc = RAPIER3D.ColliderDesc.trimesh(shield.vertices, shield.indexes);
    const shieldCollider = world.createCollider(shieldColliderDesc, ringBody);
    shieldCollider.userData = {id: RING_SHIELD};

    const gridColliderDesc = RAPIER3D.ColliderDesc.trimesh(grid.vertices, grid.indexes);
    const gridCollider = world.createCollider(gridColliderDesc, ringBody);
    gridCollider.userData = {id: RING_GRID};

    ringBody.collider = {
      ring: ringCollider,
      shield: shieldCollider,
      grid: gridCollider,
      sensor: sensorCollider
    };

    return ringBody;
  }

  /**
   * x2View
   */
  [createMethod(METHODS.create, X2VIEW)]() {
    const geometry = new THREE.SphereGeometry(0.02);
    const material = new THREE.MeshBasicMaterial({color: "red"});
    return new THREE.Mesh(geometry, material);
  }
}

function createMethod(key, type) {
  return `${key}${upperFirst(type)}`;
}