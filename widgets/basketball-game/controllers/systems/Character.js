import System from "../../../../shared/scene/ecs/core/System";
import EventComponent from "../../../../shared/scene/ecs/base/components/EventComponent";
import Matrix4Component from "../../../../shared/scene/ecs/base/components/transform/Matrix4Component";
import Body from "../../../../shared/scene/ecs/rapier/components/Body";
import ThreeComponent from "../../../../shared/scene/ecs/three/components/ThreeComponent";
import GSAPTween from "../../../../shared/scene/ecs/base/components/tween/GSAPTween";
import {clamp} from "lodash";
import {createAnimationFrame} from "../../../../shared/lib/browserApi/frames";
import returnCharacterToInitialPositionTween from "../../lib/animations/returnCharacterToInitialPositionTween";
import teleportActorToInitialPositionTween from "../../lib/animations/teleportActorToInitialPositionTween";
import {CHARACTER} from "../../entities/character";
import {DRAG_END, DRAG_MOVE, DRAG_START} from "../../../../shared/constants/events/eventsNames";
import {COLLISION_START} from "../../constants/events";
import {GROUND} from "../../entities/ground";
import {TWEENS} from "../../constants/tweens";
import {RING} from "../../entities/ring";

export default class Character extends System {

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
        gameSpace,
        mainSceneSettings: {character: {startData: {position}}}
      }
    } = this;

    gameSpace.returnsBack = true;

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

    gameSpace.returnsBack = false;
  }

  throwBall({eRing, eCharacter, drag, end, speed, distance, duration}) {
    const {storage: {gameSpace}} = this;

    gameSpace.thrown = true;

    const cBody = eCharacter.get(Body);

    cBody.object.setBodyType(RAPIER3D.RigidBodyType.Dynamic);
    cBody.object.wakeUp();

    gameSpace.serviceData.clearFunctions.push(createAnimationFrame(() => {
      const target = eRing.get(Body).object.translation();
      const props = {eCharacter, drag, end, target, speed, distance, duration};
      const x = this.calculateX(props);
      const y = this.calculateY(props);
      const z = this.calculateZ(props);
      const throwPoint = new THREE.Vector3(x, y, z);

      const {storage: {world, mainSceneSettings: {character: {throw: {angvel, duration: throwDuration}}}}} = this;
      const bodyPosition = cBody.object.translation();
      const mass = cBody.object.mass();
      const distanceBetween = throwPoint.clone().sub(bodyPosition);
      const startSpeed = new THREE.Vector3(
        distanceBetween.x / throwDuration,
        (distanceBetween.y - 0.5 * world.gravity.y * throwDuration ** 2) / throwDuration,
        distanceBetween.z / throwDuration
      );
      const impulse = startSpeed.clone().multiplyScalar(mass);
      cBody.object.setLinvel({x: 0, y: 0, z: 0});
      cBody.object.applyImpulse(impulse);
      cBody.object.setAngvel(angvel);
    }));
  }

  calculateX({drag, end, target}) {
    const {storage: {camera, mainSceneSettings: {character: {throw: {protectedAngle}}}}, helpers: {raycaster}} = this;

    const [drag2d, end2d] = [drag, end].map(({normalizedX, normalizedY}) => {
      const intersectionPoint = new THREE.Vector3();
      const planeForIntersect = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);
      raycaster.ray.intersectPlane(planeForIntersect, intersectionPoint);
      return new THREE.Vector2(intersectionPoint.x, -intersectionPoint.y);
    });

    const swipeVec = new THREE.Vector2(end2d.x - drag2d.x, end2d.y - drag2d.y);
    const directionBetweenVec = new THREE.Vector2(target.x - drag2d.x, target.z - drag2d.y);

    const angle = THREE.MathUtils.radToDeg(
      Math.acos(
        swipeVec.dot(directionBetweenVec)
        /
        (swipeVec.length() * directionBetweenVec.length())
      )
    );

    if (angle <= protectedAngle)
      return target.x;
    else
      return swipeVec.clone().normalize().multiplyScalar(directionBetweenVec.length()).x;
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

  checkCollision({eCharacter}) {
    const {storage: {gameSpace}} = this;
    if (!gameSpace.thrown) return;

    const collisions = eCharacter.getSome(EventComponent, COLLISION_START);
    if (!collisions.some(({data: {entity}}) => entity.type === GROUND)) return;

    const cTween = eCharacter.get(GSAPTween);
    if (cTween.has(TWEENS.teleportOnInitialPosition)) return;

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
    });

    gameSpace.thrown = false;
  }

  update() {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const eRing = this.getFirstEntityByType(RING);
    const fullProps = {eCharacter, eRing};
    this.updateMovement(fullProps);
    this.checkCollision(fullProps);
  }
}