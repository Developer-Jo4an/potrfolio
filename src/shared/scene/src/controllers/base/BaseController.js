import {cloneDeep} from "lodash";

export class BaseController {
  storage = {};

  constructor(data) {
    for (const key in data) this[key] = data[key];
  }

  async init() {
    await this.loadAssets();
    await this.initScene();
    await this.initMainSceneSettings();
  }

  appendContainer($container) {
    this.$container = $container;
  }

  prepare() {}

  async loadAssets() {}

  async initScene() {}

  async initMainSceneSettings() {
    const {storage, mainSceneSettings} = this;
    if (mainSceneSettings) storage.mainSceneSettings = cloneDeep(mainSceneSettings);
  }

  reset() {

  }
}
