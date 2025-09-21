import EventDispatcher from "../../lib/event-dispatcher/EventDispatcher";
import {copy} from "../../../lib/copy/copy";

export default class BaseController {

  eventBus = new EventDispatcher();

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
      storage.mainSceneSettings = copy(mainSceneSettings);
  }
}