import System from "../../../../shared/scene/ecs/core/System";
import EventComponent from "../../../../shared/scene/ecs/base/components/EventComponent";
import Body from "../../../../shared/scene/ecs/rapier/components/Body";
import ThreeComponent from "../../../../shared/scene/ecs/three/components/ThreeComponent";
import GSAPTween from "../../../../shared/scene/ecs/base/components/tween/GSAPTween";
import Matrix4Component from "../../../../shared/scene/ecs/base/components/transform/Matrix4Component";
import {clamp, upperFirst} from "lodash";
import {createAnimationFrame} from "../../../../shared/lib/browserApi/frames";
import returnCharacterToInitialPositionTween from "../../lib/animations/returnCharacterToInitialPositionTween";
import teleportActorToInitialPositionTween from "../../lib/animations/teleportActorToInitialPositionTween";
import {CHARACTER} from "../../entities/character";
import {DRAG_END, DRAG_MOVE, DRAG_START} from "../../../../shared/constants/events/eventsNames";
import {CLEAR_HIT, COLLISION_START} from "../../constants/events";
import {GROUND} from "../../entities/ground";
import {TWEENS} from "../../constants/tweens";
import {RING, RING_BODY, RING_GRID, RING_SHIELD, SENSOR} from "../../entities/ring";
import {UUIDS} from "../../constants/systems";

export default class Character extends System {

  uuid = UUIDS.character;

  helpers = {
    raycaster: new THREE.Raycaster()
  };

  updateMovement({eCharacter, eRing}) {
    const csEvent = eCharacter.getSome(EventComponent, DRAG_START, DRAG_MOVE, DRAG_END);

    if (!csEvent?.length) return;

    const {data: {cursor: current}} = csEvent[csEvent.length - 1];
    const cursor = new THREE.Vector2(current.normalizedX, current.normalizedY);
    const {storage: {camera}, helpers: {raycaster}} = this;
    const cBody = eCharacter.get(Body);
    const planeForIntersect = new THREE.Plane(new THREE.Vector3(0, 0, 1), cBody.object.translation().z);

    const intersectionPoint = new THREE.Vector3();
    raycaster.setFromCamera(cursor, camera);
    raycaster.ray.intersectPlane(planeForIntersect, intersectionPoint);

    const {storage: {mainSceneSettings: {character: {movement: {clamp: {x, y, z}}}}}} = this;

    const formattedIntersectPoint = {
      x: clamp(intersectionPoint.x, ...x),
      y: clamp(intersectionPoint.y, ...y),
      z: clamp(intersectionPoint.z, ...z)
    };

    cBody.object.setTranslation(formattedIntersectPoint);

    const lastEvent = csEvent[csEvent.length - 1];
    if (lastEvent.type === DRAG_END)
      this.throw({eCharacter, eRing});
  }

  throw({eCharacter, eRing}) {
    const {storage: {mainSceneSettings: {character: {throw: {speed: {s}}}}}} = this;

    const throwData = this.calculateThrowData(eCharacter);
    const fullProps = {eCharacter, eRing, ...(throwData ?? {})};

    if (!throwData || throwData.speed < s)
      this.returnCharacterToInitialPosition(fullProps);
    else
      this.throwBall(fullProps);
  }

  calculateThrowData(eCharacter) {
    const {helpers: {raycaster}, storage: {camera}} = this;
    const [,
      {data: {cursor: drag}},
      {data: {cursor: end}}
    ] = eCharacter.getSome(EventComponent, DRAG_START, DRAG_MOVE, DRAG_END);

    if (drag.normalizedX === end.normalizedX && drag.normalizedY === end.normalizedY) return;

    const [d3Drag, d3End] = [drag, end].map(({normalizedX, normalizedY}) => {
      const intersectionPoint = new THREE.Vector3();
      const planeForIntersect = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);
      raycaster.ray.intersectPlane(planeForIntersect, intersectionPoint);
      return intersectionPoint;
    });

    const distance = d3Drag.clone().sub(d3End).length();
    const duration = (end.timestamp - drag.timestamp) / 1000;
    const speed = distance / duration;

    return {distance, duration, drag, end, speed};
  }

  async returnCharacterToInitialPosition({eCharacter}) {
    const {
      storage: {
        gameSpace: {set},
        mainSceneSettings: {character: {startData: {position}}}
      }
    } = this;

    set(({characterMovement}) => {
      characterMovement.returnsBack = true;
    });

    const cBody = eCharacter.get(Body);

    const returnTween = returnCharacterToInitialPositionTween(cBody.object, position);
    const cTween = eCharacter.get(GSAPTween);
    cTween.add(returnTween);
    await new Promise(res => {
      returnTween.eventCallback("onComplete", () => {
        cTween.remove(returnTween.id);
        res();
      });
    });

    set(({characterMovement}) => {
      characterMovement.returnsBack = false;
    });
  }

  throwBall({eRing, eCharacter, drag, end, speed, distance, duration}) {
    const {storage: {gameSpace: {set}}} = this;

    const cBody = eCharacter.get(Body);

    cBody.object.setBodyType(RAPIER3D.RigidBodyType.Dynamic);

    set(({serviceData: {clearFunctions}, characterMovement}) => {
      clearFunctions.push(createAnimationFrame(() => {
        const target = eRing.get(Body).object.translation();
        const props = {eCharacter, drag, end, target, speed, distance, duration};
        const x = this.calculateX(props);
        const y = this.calculateY(props);
        const z = this.calculateZ(props);
        const time = this.calculateTime(x, y, z, target);
        const throwPoint = new THREE.Vector3(x, y, z);

        const {storage: {world, mainSceneSettings: {character: {throw: {angvel}}}}} = this;
        const bodyPosition = cBody.object.translation();
        const mass = cBody.object.mass();
        const vectorBetweenBallAndTarget = throwPoint.clone().sub(bodyPosition);
        const zeroV = new THREE.Vector3(
          vectorBetweenBallAndTarget.x / time,
          (vectorBetweenBallAndTarget.y - 0.5 * world.gravity.y * time ** 2) / time,
          vectorBetweenBallAndTarget.z / time
        );
        const impulse = zeroV.clone().multiplyScalar(mass);

        this.applyPhysicalPropertiesForThrow({impulse, angvel});
      }));

      characterMovement.thrown = true;
    });
  }

  calculateX({drag, end, target}) {
    const {storage: {camera}, helpers: {raycaster}} = this;

    const [drag2d, end2d] = [drag, end].map(({normalizedX, normalizedY}) => {
      const intersectionPoint = new THREE.Vector3();
      const planeForIntersect = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);
      raycaster.ray.intersectPlane(planeForIntersect, intersectionPoint);
      return new THREE.Vector2(intersectionPoint.x, -intersectionPoint.y);
    });

    const swipeVec = new THREE.Vector2(end2d.x - drag2d.x, end2d.y - drag2d.y);
    const directionBetweenVec = new THREE.Vector2(target.x - drag2d.x, target.z - drag2d.y);

    return swipeVec.setLength(directionBetweenVec.length()).x;
  }

  calculateY({speed, target}) {
    return this.calculateVerticalAxis({speed, axisValue: target.y});
  }

  calculateZ({speed, target}) {
    return this.calculateVerticalAxis({speed, axisValue: target.z});
  }

  calculateVerticalAxis({speed, axisValue}) {
    const {storage: {mainSceneSettings: {character: {throw: {speed: {s, m, l, xl}}}}}} = this;

    const balancedSpeed = clamp(speed, s, xl);

    if (balancedSpeed >= m && balancedSpeed <= l)
      return axisValue;
    else {
      const denominator = balancedSpeed < m ? m : l;
      return balancedSpeed / denominator * axisValue;
    }
  }

  calculateTime(x, y, z, target) {
    const {storage: {mainSceneSettings: {character: {throw: {duration}}}}} = this;
    const throwVector = new THREE.Vector3(x, y, z);
    const targetVector = new THREE.Vector3(target.x, target.y, target.z);
    const multiplier = throwVector.length() / targetVector.length();
    return duration * multiplier;
  }

  activateBooster(type) {
    const {storage: {gameSpace: {set}}} = this;
    set(({booster}) => booster.active = type);
    this[createActivateMethod(type)]();
  }

  [createActivateMethod(CLEAR_HIT)]() {
    const {
      storage: {
        gameSpace: {set},
        world,
        mainSceneSettings: {character: {throw: {angvel}}, boosters: {[CLEAR_HIT]: clearHit}}
      }
    } = this;

    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const eRing = this.getFirstEntityByType(RING);

    const eMatrix4Character = eCharacter.get(Matrix4Component);
    const eMatrix4Ring = eRing.get(Matrix4Component);

    const xDiff = eMatrix4Ring.position.x - eMatrix4Character.position.x;
    const yDiff = eMatrix4Ring.position.y - eMatrix4Character.position.y / 2;
    const zDiff = eMatrix4Ring.position.z - eMatrix4Character.position.z;

    const xV = xDiff / clearHit.time;
    const yV = (yDiff - ((world.gravity.y * clearHit.time ** 2) / 2)) / clearHit.time;
    const zV = zDiff / clearHit.time;

    const cBodyCharacter = eCharacter.get(Body);
    cBodyCharacter.object.setBodyType(RAPIER3D.RigidBodyType.Dynamic);

    set(
      ({serviceData: {clearFunctions}, characterMovement}) => {
        const impulse = new THREE.Vector3(xV, yV, zV).multiplyScalar(cBodyCharacter.object.mass());
        clearFunctions.push(createAnimationFrame(() => this.applyPhysicalPropertiesForThrow({impulse, angvel})));
        characterMovement.thrown = true;
      }
    );
  }

  applyPhysicalPropertiesForThrow(
    {
      linvel = {x: 0, y: 0, z: 0},
      impulse = {x: 0, y: 0, z: 0},
      angvel = {x: 0, y: 0, z: 0}
    }) {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const cBody = eCharacter.get(Body);

    cBody.object.wakeUp();
    cBody.object.setLinvel(linvel);
    cBody.object.applyImpulse(impulse);
    cBody.object.setAngvel(angvel);
  }

  checkCollision({eCharacter}) {
    const {storage: {gameSpace: {set, get}}} = this;
    const gameSpace = get();
    if (!gameSpace.characterMovement.thrown) return;

    const collisions = eCharacter.getSome(EventComponent, COLLISION_START);

    const isHasCollisionWithRing = collisions.some(({data: {collider}}) => [RING_BODY, RING_SHIELD, RING_GRID].includes(collider.userData.id));
    if (isHasCollisionWithRing)
      set(({characterMovement}) => characterMovement.isCollisionWithRing = true);

    const isHasCollisionWithSensor = collisions.some(({data: {collider}}) => collider.userData.id === SENSOR);
    if (isHasCollisionWithSensor) {
      if (!gameSpace.characterMovement.isCollisionWithSensor && !gameSpace.characterMovement.isCollisionWithRing) {
        const {eventBus} = this;
        eCharacter.add(new EventComponent({eventBus, type: CLEAR_HIT}));
      }
      set(({characterMovement}) => characterMovement.isCollisionWithSensor = true);
    }

    const isHasCollisionWithGround = collisions.some(({data: {entity}}) => entity.type === GROUND);
    if (isHasCollisionWithGround && (!gameSpace.booster.active || gameSpace.characterMovement.isCollisionWithSensor)) {
      const cTween = eCharacter.get(GSAPTween);
      if (!cTween.has(TWEENS.teleportOnInitialPosition)) {
        const {storage: {mainSceneSettings: {character: {startData: {position, rotation}}}}} = this;
        const cThreeComponent = eCharacter.get(ThreeComponent);
        const cBody = eCharacter.get(Body);

        const teleportTween = teleportActorToInitialPositionTween(
          cThreeComponent.threeObject,
          () => {
            cBody.object.setBodyType(RAPIER3D.RigidBodyType.KinematicPositionBased);
            cBody.object.setLinvel({x: 0, y: 0, z: 0});
            cBody.object.setAngvel({x: 0, y: 0, z: 0});
            cBody.object.setTranslation(position);
            cBody.object.setRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler().setFromVector3(rotation)));
          }
        );
        cTween.add(teleportTween);
        teleportTween.eventCallback("onComplete", () => {
          cTween.remove(teleportTween.id);
          set(({characterMovement, booster}) => {
            booster.active = null;
            characterMovement.thrown = false;
            characterMovement.isCollisionWithRing = false;
            characterMovement.isCollisionWithSensor = false;
          });
        });
      }
    }
  }

  update() {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const eRing = this.getFirstEntityByType(RING);
    const fullProps = {eCharacter, eRing};
    this.updateMovement(fullProps);
    this.checkCollision(fullProps);
  }
}

function createActivateMethod(type) {
  return `activateBooster${upperFirst(type)}`;
}