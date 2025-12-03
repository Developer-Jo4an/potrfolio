import BaseLoader from "../base/BaseLoader";
import {upperFirst} from "lodash";

export default class ThreeLoader extends BaseLoader {
  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
  }

  loadAssets(assets) {
    return Promise.all(assets.map(({name, type, src}) => {
      return this[`load${upperFirst(type)}`](name, src);
    }));
  }

  loadTexture(name, src) {

  }
}

export const threeLoader = new ThreeLoader();