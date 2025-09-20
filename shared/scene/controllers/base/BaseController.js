import EventDispatcher from "../../utils/event-dispatcher/EventDispatcher";

export default class BaseController {

  eventDispatcher = new EventDispatcher();

  constructor(data) {
    for (const key in data)
      this[key] = data[key];
  }

  async init() {
    await this.loadAssets();
    await this.initScene();
  }

  async loadAssets() {

  }

  async initScene() {

  }
}