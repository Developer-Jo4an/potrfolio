import {upperFirst} from "lodash";
import {assetsManager, Factory, PIXI_SPACE, TEXTURE} from "@shared";
import {ABSTRACT_TREE} from "./entities/AbstractTree";
import {CELL_BACKGROUND} from "../constants/preload";
import {CELL} from "./entities/Cell";

const METHODS = {create: "create", prepare: "prepare", reset: "reset"};

export class TileExplorerFactory extends Factory {
  constructor(data) {
    super(...arguments);
    this.defaultProperties = data;
  }

  getItemByType(type, data) {
    return this[createMethod(METHODS.create, type)]?.(data);
  }

  getItem(type, data) {
    const storage = this.getStorage(type);
    let item = storage.pop();
    if (item) this[createMethod(METHODS.prepare, type)]?.(item, data);
    else item = this.createItem(type, data);
    return item;
  }

  pushItem(item) {
    const type = item._storageType ?? "unknown";
    const storage = this.getStorage(type);
    this[createMethod(METHODS.reset, type)]?.(item);
    storage.push(item);
  }

  /**
   * abstract tree
   */
  [createMethod(METHODS.create, ABSTRACT_TREE)]() {
    const asset = new PIXI.Container();
    asset.label = ABSTRACT_TREE;
    return asset;
  }

  [createMethod(METHODS.reset, CELL)](asset) {
    asset.position.set(0, 0);
    asset.scale.set(0, 0);
  }

  /**
   * cell
   */
  [createMethod(METHODS.create, CELL)]({type}) {
    const asset = new PIXI.Container();
    asset.label = CELL;

    const {
      defaultProperties: {
        storage: {
          mainSceneSettings: {
            cell: {anchor}
          }
        }
      }
    } = this;

    const background = new PIXI.Sprite();
    background.label = CELL_BACKGROUND;
    background.anchor.set(anchor);
    background.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, CELL_BACKGROUND);
    asset.addChild(background);

    const sprite = new PIXI.Sprite();
    sprite.label = type;
    sprite.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, type);
    sprite.anchor.set(anchor);
    asset.addChild(sprite);

    return asset;
  }

  [createMethod(METHODS.reset, CELL)](asset) {
    asset.position.set(0, 0);
    asset.scale.set(0, 0);
    asset.children.forEach(child => {
      child.position.set(0, 0);
      child.scale.set(0, 0);
    });
  }
}

function createMethod(key, type) {
  return `${key}${upperFirst(type)}`;
}
