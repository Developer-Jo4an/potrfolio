import {cloneDeep} from "lodash";

export default class BaseController {

  storage = {};

  constructor(data) {
    for (const key in data)
      this[key] = data[key];
  }

  async init() {
    await this.loadAssets();
    await this.initScene();
    await this.initMainSceneSettings();
  }

  async loadAssets() {

  }

  async initScene() {

  }

  initMainSceneSettings() {
    const {storage, mainSceneSettings} = this;
    if (mainSceneSettings)
      storage.mainSceneSettings = cloneDeep(mainSceneSettings);
  }
}