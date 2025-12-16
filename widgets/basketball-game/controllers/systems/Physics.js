import System from "../../../../shared/scene/ecs/core/System";
import Body from "../../../../shared/scene/ecs/rapier/components/Body";
import {CHARACTER} from "../../entities/character";
import ThreeComponent from "../../../../shared/scene/ecs/three/components/ThreeComponent";

export default class Physics extends System {
  updatePhysics() {

  }

  update({deltaTime}) {
    this.updatePhysics();
  }
}