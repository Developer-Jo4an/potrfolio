import System from "../../../../shared/scene/ecs/core/System";
import EventComponent from "../../../../shared/scene/ecs/base/components/EventComponent";
import Matrix4Component from "../../../../shared/scene/ecs/base/components/transform/Matrix4Component";
import Body from "../../../../shared/scene/ecs/rapier/components/Body";
import {clamp} from "lodash";
import returnCharacterOnInitialPosition from "../../lib/animations/returnCharacterOnInitialPosition";
import {createAnimationFrame} from "../../../../shared/lib/browserApi/frames";
import {CHARACTER} from "../../entities/character";
import {DRAG_END, DRAG_MOVE, DRAG_START} from "../../../../shared/constants/events/eventsNames";

export default class Character extends System {

  helpers = {
    intersectionPoint: null,
    plane: null,
    raycaster: null
  };

  init() {
    const {helpers} = this;

    helpers.intersectionPoint = new THREE.Vector3();
    helpers.cursor = new THREE.Vector2();
    helpers.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    helpers.raycaster = new THREE.Raycaster();
    helpers.throwVector = new THREE.Vector2();
  }

  updateMovement({eCharacter}) {
    const csEvent = eCharacter.getSome(EventComponent, DRAG_START, DRAG_MOVE, DRAG_END);

    if (!csEvent?.length) return;

    const {data: {cursor: current}} = csEvent[csEvent.length - 1];
    const {storage: {camera}, helpers: {intersectionPoint, plane, cursor, raycaster}} = this;
    raycaster.setFromCamera(cursor.set(current.normalizedX, current.normalizedY), camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);

    const {storage: {mainSceneSettings: {character: {movement: {clamp: {x, y, z}}}}}} = this;
    const formattedIntersectPoint = {
      x: clamp(intersectionPoint.x, ...x),
      y: clamp(intersectionPoint.y, ...y),
      z: clamp(intersectionPoint.z, ...z)
    };
    const cBody = eCharacter.get(Body);
    cBody.object.setTranslation(formattedIntersectPoint);

    const lastEvent = csEvent[csEvent.length - 1];
    if (lastEvent.type === DRAG_END)
      this.throw(eCharacter);
  }

  async throw(eCharacter) {
    const {
      helpers: {throwVector},
      storage: {mainSceneSettings: {character: {movement: {pointsCount, speed: {min}}}}}
    } = this;
    const csEvent = eCharacter.getSome(EventComponent, DRAG_START, DRAG_MOVE, DRAG_END);
    const slicedPoints = csEvent.slice(-pointsCount).map(({data: {cursor}}) => cursor);
    slicedPoints.splice(1, slicedPoints.length - 2);
    const [start, end] = slicedPoints;
    throwVector.set(end.x - start.x, end.y - start.y);
    const distance = throwVector.length();
    const time = end.timestamp - start.timestamp;
    const speed = distance / time;

    const {
      storage: {
        gameSpace,
        gameSpace: {serviceData},
        mainSceneSettings: {character: {startData: {position}}}
      }
    } = this;
    const cBody = eCharacter.get(Body);
    if (speed <= min) {
      gameSpace.returnsBack = true;
      await returnCharacterOnInitialPosition(cBody.object, position);
      gameSpace.returnsBack = false;
    } else {
      gameSpace.thrown = true;
      cBody.object.setBodyType(RAPIER3D.RigidBodyType.Dynamic);
      serviceData.clearFunctions.push(createAnimationFrame(() => {
        cBody.object.applyImpulse({x: 0, y: 0.035,  z: -0.05}, true);
        cBody.object.setAngvel({x: 12, y: 0, z: 0}, true);
      }));
    }
  }

  update() {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const fullProps = {eCharacter};
    this.updateMovement(fullProps);
  }
}