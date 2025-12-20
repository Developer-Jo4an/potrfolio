import System from "../../../../shared/scene/ecs/core/System";
import EventComponent from "../../../../shared/scene/ecs/base/components/EventComponent";
import Matrix4Component from "../../../../shared/scene/ecs/base/components/transform/Matrix4Component";
import Body from "../../../../shared/scene/ecs/rapier/components/Body";
import {CHARACTER} from "../../entities/character";
import {clamp} from "lodash";
import {DRAG_END} from "../../../../shared/constants/events/eventsNames";
import returnCharacterOnInitialPosition from "../../lib/animations/returnCharacterOnInitialPosition";

export default class Character extends System {
  helpers = {
    intersectionPoint: null,
    plane: null,
    raycaster: null
  };

  init() {
    const {helpers} = this;

    helpers.intersectionPoint = new THREE.Vector3(0, 0, 0);
    helpers.cursor = new THREE.Vector2(0, 0);
    helpers.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    helpers.raycaster = new THREE.Raycaster();
  }

  updateMovement({eCharacter}) {
    const {storage: {gameSpace}} = this;
    const csEvent = eCharacter.getList(EventComponent);

    if (!csEvent?.length || gameSpace.returnsBack) return;

    const {data: {cursor: current}} = csEvent[csEvent.length - 1];
    const {storage: {camera}, helpers: {intersectionPoint, plane, cursor, raycaster}} = this;
    raycaster.setFromCamera(cursor.set(current.normalizedX, current.normalizedY), camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);

    const {storage: {mainSceneSettings: {character: {movement: {x, y, z}}}}} = this;
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
    const {storage: {gameSpace}} = this;
    gameSpace.returnsBack = true;

    const {storage: {mainSceneSettings: {character: {startData: {position}}}}} = this;
    const eBody = eCharacter.get(Body);
    await returnCharacterOnInitialPosition(eBody.object, position);

    gameSpace.returnsBack = false;
  }

  update() {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const fullProps = {eCharacter};
    this.updateMovement(fullProps);
  }
}