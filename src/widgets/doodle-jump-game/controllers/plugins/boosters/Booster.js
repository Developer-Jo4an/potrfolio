import {Plugin} from "@shared";

export class Booster extends Plugin {
  createConfig() {
    return {
      resolveTime: 0,
      config: [],
    };
  }
}
