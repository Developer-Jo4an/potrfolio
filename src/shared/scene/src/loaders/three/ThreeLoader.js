import {BaseLoader} from "../base/BaseLoader";
import {upperFirst} from "lodash";
import {GLTF, TEXTURE, THREE_SPACE} from "../../constants/loaders/assetsTypes";
import {assetsManager} from "../../assets/AssetsManager";

export class ThreeLoader extends BaseLoader {
  LOADERS = {[TEXTURE]: THREE.TextureLoader, [GLTF]: THREE.GLTFLoader};

  async init(preload) {
    if (this.isInitialized) return;
    this.loaders = preload.reduce((acc, {type}) => {
      acc[type] ??= new this.LOADERS[type]();
      return acc;
    }, {});
    this.isInitialized = true;
  }

  loadAssets(assets) {
    return Promise.all(
      assets.map(({name, type, src}) => {
        return this[`load${upperFirst(type)}`](name, src);
      }),
    );
  }

  async loadTexture(name, src) {
    const {
      loaders: {[TEXTURE]: textureLoader},
    } = this;
    const texture = await textureLoader.loadAsync(src);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
    texture.flipY = false;
    assetsManager.setAssetsToSpace(THREE_SPACE, TEXTURE, name, texture);
  }

  async loadGLTF(name, src) {
    const {
      loaders: {[GLTF]: gltfLoader},
    } = this;
    await new Promise((res) =>
      gltfLoader.load(
        src,
        (data) => {
          assetsManager.setAssetsToSpace(THREE_SPACE, GLTF, name, data);
          res();
        },
        null,
        res,
      ),
    );
  }
}
