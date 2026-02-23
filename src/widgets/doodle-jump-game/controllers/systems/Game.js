import {MainGame} from "@shared";

export class Game extends MainGame {
  constructor(data) {
    super({...data, types: data.storage.types});
  }

  update(data) {}
}
