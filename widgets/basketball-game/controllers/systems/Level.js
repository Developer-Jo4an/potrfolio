import System from "../../../../shared/scene/ecs/core/System";
import Entity from "../../../../shared/scene/ecs/core/Entity";
import ThreeComponent from "../../../../shared/scene/ecs/three/components/ThreeComponent";
import Body from "../../../../shared/scene/ecs/rapier/components/Body";
import Mixer from "../../../../shared/scene/ecs/three/components/Mixer";
import {mean} from "lodash";
import getVerticesWithDeep from "../../utils/getVerticesWithDeep";
import add from "../../../../shared/scene/ecs/three/side-effects/add";
import {CHARACTER, CHARACTER_BODY} from "../../entities/character";
import {GROUND, GROUND_BODY} from "../../entities/ground";
import {
  ANIMATIONS,
  RING,
  RING_BODY,
  RING_GRID_VIEW_NAME,
  RING_SHIELD_VIEW_NAME,
  RING_VIEW_NAME
} from "../../entities/ring";
import {X, Y, Z} from "../../../../shared/constants/trigonometry/trigonometry";
import {assetsManager} from "../../../../shared/scene/assets/AssetsManager";
import {GLTF, THREE_SPACE} from "../../../../shared/scene/constants/loaders/assetsTypes";
import {SCENE_FROM_BLENDER} from "../../constants/preload";

export default class Level extends System {
  initializationLevelSelect() {
    this.initCharacter();
    this.initRing();
    this.initGround();
  }

  initCharacter() {
    const {
      eventBus, storage: {
        scene,
        mainSceneSettings: {
          character: {
            transparent,
            receiveShadow,
            castShadow,
            opacity,
            metalness,
            roughness,
            angularDamping,
            linearDamping,
            friction,
            restitution,
            startData: {rotation, position}
          }
        }
      }
    } = this;

    const eCharacter = new Entity({eventBus, type: CHARACTER}).init();

    const cThreeComponent = eCharacter.get(ThreeComponent);
    const characterView = cThreeComponent.threeObject = this.getAsset(eCharacter, CHARACTER);
    characterView.material.transparent = transparent;
    characterView.material.metalness = metalness;
    characterView.material.roughness = roughness;
    characterView.material.opacity = opacity;
    characterView.receiveShadow = receiveShadow;
    characterView.castShadow = castShadow;
    this.addSideEffect({entity: eCharacter, effect: add, args: [characterView, scene]});

    const cBody = eCharacter.get(Body);
    const {geometry: {boundingBox: {min, max}}} = characterView;
    const radius = mean([max.x - min.x, max.y - min.y, max.z - min.z].map(num => Math.abs(num / 2)));
    const characterBody = cBody.object = this.getAsset(eCharacter, CHARACTER_BODY, {radius});
    characterBody.setTranslation(position);
    characterBody.setRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler().setFromVector3(rotation)));
    characterBody.setBodyType(RAPIER3D.RigidBodyType.KinematicPositionBased);
    characterBody.setLinearDamping(linearDamping);
    characterBody.setAngularDamping(angularDamping);
    characterBody.collider.setRestitution(restitution);
    characterBody.collider.setFriction(friction);
    characterBody.collider.setActiveEvents(RAPIER3D.ActiveEvents.COLLISION_EVENTS);
  }

  initRing() {
    const {
      eventBus, storage: {
        scene,
        mainSceneSettings: {
          ring: {
            tube,
            geometryRotation,
            sensor,
            grid,
            transparent,
            startData: {position}
          }
        }
      }
    } = this;

    const eRing = new Entity({eventBus, type: RING}).init();
    const cThreeComponent = eRing.get(ThreeComponent);

    const ringContainer = cThreeComponent.threeObject = this.getAsset(eRing, RING);
    ringContainer.traverse(object => {
      if (object.material)
        object.material.transparent = transparent;
    });
    this.addSideEffect({entity: eRing, effect: add, args: [ringContainer, scene]});


    const ringView = ringContainer.getObjectByName(RING_VIEW_NAME);
    const ringBoundingBox = new THREE.Box3();
    ringBoundingBox.setFromObject(ringView);
    const ringRadius = Math.max(...[X, Y, Z].map(axis => {
      const maxAxis = ringBoundingBox.max[axis];
      const minAxis = ringBoundingBox.min[axis];
      return Math.abs(maxAxis - minAxis) - (tube * 2);
    })) / 2;
    const ringViewGeometry = new THREE.TorusGeometry(ringRadius, tube);
    const ringViewVertices = Array.from(ringViewGeometry.attributes.position.array);
    const ringViewIndexes = Array.from(ringViewGeometry.index.array);

    const shieldView = ringContainer.getObjectByName(RING_SHIELD_VIEW_NAME);
    const {vertices: shieldViewVertices, indexes: shieldViewIndexes} = getVerticesWithDeep(shieldView);


    const gridView = ringContainer.getObjectByName(RING_GRID_VIEW_NAME);

    const cGridMixer = eRing.get(Mixer);
    cGridMixer.mixer = new THREE.AnimationMixer(gridView);
    const {animations} = assetsManager.getAssetFromSpace(THREE_SPACE, GLTF, SCENE_FROM_BLENDER);
    cGridMixer.animations = {[ANIMATIONS.grid]: THREE.AnimationClip.findByName(animations, ANIMATIONS.grid)};
    this.addSideEffect({
      entity: eRing,
      effect: () => () => {
        cGridMixer.mixer.stopAllAction();
        gridView.children[0].skeleton.pose();
      }
    });

    const gridBoundingBox = new THREE.Box3();
    gridBoundingBox.setFromObject(ringView);
    const gridRadiusTop = Math.max(...[X, Y, Z].map(axis => {
      const maxAxis = gridBoundingBox.max[axis];
      const minAxis = gridBoundingBox.min[axis];
      return Math.abs(maxAxis - minAxis);
    })) / 2;
    const radiusBottom = gridRadiusTop * grid.radsProportion;
    const gridViewGeometry = new THREE.CylinderGeometry(
      gridRadiusTop,
      radiusBottom,
      grid.height,
      grid.radialSegments,
      grid.heightSegments,
      grid.openEnded,
      grid.thetaStart,
      grid.thetaLength
    );
    const gridOffsetMatrix = new THREE.Matrix4();
    gridOffsetMatrix.makeTranslation(0, -grid.height / 2, 0);
    gridViewGeometry.applyMatrix4(gridOffsetMatrix);
    gridViewGeometry.dispose();
    const gridViewVertices = Array.from(gridViewGeometry.attributes.position.array);
    const gridViewIndexes = Array.from(gridViewGeometry.index.array);


    const cBody = eRing.get(Body);
    const ringBody = cBody.object = this.getAsset(eRing, RING_BODY, {
      ring: {
        view: ringView,
        vertices: ringViewVertices,
        indexes: ringViewIndexes,
        extraProps: {
          rotation: geometryRotation
        }
      },
      shield: {
        view: shieldView,
        vertices: shieldViewVertices,
        indexes: shieldViewIndexes,
        extraProps: {}
      },
      grid: {
        view: gridView,
        vertices: gridViewVertices,
        indexes: gridViewIndexes,
        extraProps: {}
      },
      sensor
    });

    ringBody.setTranslation(position);
    ringBody.collider.ring.setActiveEvents(RAPIER3D.ActiveEvents.COLLISION_EVENTS);
    ringBody.collider.grid.setFriction(grid.friction);
    ringBody.collider.grid.setRestitution(grid.restitution);
  }

  initGround() {
    const {
      eventBus,
      storage: {scene, mainSceneSettings: {ground: {height, castShadow, friction, restitution, receiveShadow}}}
    } = this;

    const eGroud = new Entity({eventBus, type: GROUND}).init();

    const cThreeComponent = eGroud.get(ThreeComponent);
    const groundView = this.getAsset(eGroud, GROUND);
    groundView.name = GROUND;
    groundView.receiveShadow = receiveShadow;
    groundView.castShadow = castShadow;
    cThreeComponent.threeObject = groundView;
    this.addSideEffect({entity: eGroud, effect: add, args: [groundView, scene]});

    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const cCharacterBody = eCharacter.get(Body);
    const characterBodyRadius = cCharacterBody.object.collider.shape.radius;
    const cBody = eGroud.get(Body);
    const vertices = Array.from(groundView.geometry.attributes.position.array);
    const indexes = Array.from(groundView.geometry.index.array);
    const groundBody = cBody.object = this.getAsset(eGroud, GROUND_BODY, {vertices, indexes});
    groundBody.setTranslation({x: 0, y: -height / 2 - characterBodyRadius, z: 0});
    groundBody.collider.setFriction(friction);
    groundBody.collider.setRestitution(restitution);
    groundBody.collider.setFrictionCombineRule(RAPIER3D.CoefficientCombineRule.Max);
    groundBody.collider.setRestitutionCombineRule(RAPIER3D.CoefficientCombineRule.Average);
    groundBody.collider.setActiveEvents(RAPIER3D.ActiveEvents.COLLISION_EVENTS);
  }

  update({deltaTime}) {
  }
}