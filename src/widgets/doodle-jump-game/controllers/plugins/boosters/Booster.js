import {Plugin} from "../Plugin";

export class Booster extends Plugin {
  createConfig() {
    return {
      resolveTime: 0,
      config: [],
    };
  }
}
