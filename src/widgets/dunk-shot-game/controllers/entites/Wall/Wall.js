import {BasePhysicsEntity} from "../base/BasePhysicsEntity";
import {cloneDeep} from "lodash";
import {COLLISION_FILTERS} from "../../constants/collision";

export class Wall extends BasePhysicsEntity {
  constructor(data) {
    super(data);

    this.init();
  }

  init() {
    this.initBody();
  }

  initBody() {
    const {
      direction,
      storage: {
        mainSceneSettings: {wall: wallSettings},
      },
    } = this;
    const params = wallSettings[direction].params;
    const body = (this.body = Matter.Bodies.rectangle(...params));
    body.collisionFilter = cloneDeep(COLLISION_FILTERS.WALL);
  }

  addToSpaces() {
    this.addToWorld();
  }
}
