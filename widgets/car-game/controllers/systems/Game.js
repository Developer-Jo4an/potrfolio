import MainGame from "../../../../shared/scene/ecs/base/systems/MainGame";

export default class Game extends MainGame {
  constructor(data) {
    super({...data, types: data.storage.types});
  }

  update(data) {
  }
}
