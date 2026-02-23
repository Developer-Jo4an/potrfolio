import {upperFirst} from "lodash";
import {resetPixiObject} from "../utils/helpers/resetPixiObject";
import {CHARACTER} from "./constants/entities/character";
import {MAIN_CONTAINER} from "./constants/entities/mainContainer";
import {ROAD_CHUNK} from "./constants/entities/roadChunk";
import {BONUS} from "./constants/entities/bonus";
import {BLOCK} from "./constants/entities/block";
import {ROAD_CHUNKS_CONTAINER} from "./constants/entities/roadChunksContainer";
import {PIXI_SPACE, TEXTURE, assetsManager, Factory} from "@shared";

export class CarFactory extends Factory {
  static METHODS = {create: "create", prepare: "prepare", reset: "reset"};

  constructor(data) {
    super();
    this.defaultProperties = data;
  }

  static createMethod(key, type) {
    return `${key}${upperFirst(type)}`;
  }

  getItemByType(type, data) {
    return this[CarFactory.createMethod(CarFactory.METHODS.create, type)]?.(data);
  }

  getItem(type, data) {
    const storage = this.getStorage(type);
    let item = storage.pop();
    if (item) this[CarFactory.createMethod(CarFactory.METHODS.prepare, type)]?.(item, data);
    else item = this.createItem(type, data);
    return item;
  }

  pushItem(item) {
    const type = item._storageType ?? "unknown";
    const storage = this.getStorage(type);
    this[CarFactory.createMethod(CarFactory.METHODS.reset, type)]?.(item);
    storage.push(item);
  }

  /**
   * character
   */
  [`reset${upperFirst(CHARACTER)}`](characterSprite) {
    resetPixiObject(characterSprite);
  }

  [`prepare${upperFirst(CHARACTER)}`](characterSprite) {
    const {
      defaultProperties: {
        storage: {
          mainSceneSettings: {
            character: {anchor, zIndex},
          },
        },
      },
    } = this;
    characterSprite.label = CHARACTER;
    characterSprite.anchor.set(...anchor);
    characterSprite.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, CHARACTER);
    characterSprite.zIndex = zIndex;
  }

  [`create${upperFirst(CHARACTER)}`]() {
    const {
      defaultProperties: {
        storage: {
          mainSceneSettings: {
            character: {anchor, zIndex},
          },
        },
      },
    } = this;
    const texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, CHARACTER);
    const characterSprite = new PIXI.Sprite(texture);
    characterSprite.label = CHARACTER;
    characterSprite.anchor.set(...anchor);
    characterSprite.zIndex = zIndex;
    return characterSprite;
  }

  /**
   * mainContainer
   */
  [`reset${upperFirst(MAIN_CONTAINER)}`](mainContainer) {
    resetPixiObject(mainContainer);
  }

  [`prepare${upperFirst(MAIN_CONTAINER)}`](mainContainer) {
    mainContainer.label = MAIN_CONTAINER;
  }

  [`create${upperFirst(MAIN_CONTAINER)}`]() {
    const mainContainer = new PIXI.Container();
    mainContainer.label = MAIN_CONTAINER;
    return mainContainer;
  }

  /**
   * roadChunksContainer
   */
  [`reset${upperFirst(ROAD_CHUNKS_CONTAINER)}`](roadChunksContainer) {
    resetPixiObject(roadChunksContainer);
  }

  [`prepare${upperFirst(ROAD_CHUNKS_CONTAINER)}`](roadChunksContainer) {
    roadChunksContainer.label = ROAD_CHUNKS_CONTAINER;
    roadChunksContainer.mask.label = ROAD_CHUNKS_CONTAINER;
    roadChunksContainer.addChild(roadChunksContainer.mask);
  }

  [`create${upperFirst(ROAD_CHUNKS_CONTAINER)}`]() {
    const roadChunksContainer = new PIXI.Container();
    roadChunksContainer.label = ROAD_CHUNKS_CONTAINER;
    const mask = (roadChunksContainer.mask = new PIXI.Graphics());
    mask.label = ROAD_CHUNKS_CONTAINER;
    roadChunksContainer.addChild(mask);
    return roadChunksContainer;
  }

  /**
   * roadChunk
   */
  [`reset${upperFirst(ROAD_CHUNK)}`](roadChunkSprite) {
    resetPixiObject(roadChunkSprite);
  }

  [`prepare${upperFirst(ROAD_CHUNK)}`](roadChunkSprite) {
    const {
      defaultProperties: {
        storage: {
          mainSceneSettings: {
            roadChunks: {anchor},
          },
        },
      },
    } = this;
    roadChunkSprite.label = ROAD_CHUNK;
    roadChunkSprite.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, ROAD_CHUNK);
    roadChunkSprite.anchor.set(...anchor);
  }

  [`create${upperFirst(ROAD_CHUNK)}`]() {
    const {
      defaultProperties: {
        storage: {
          mainSceneSettings: {
            roadChunks: {anchor},
          },
        },
      },
    } = this;
    const texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, ROAD_CHUNK);
    const roadChunkSprite = new PIXI.TilingSprite(texture);
    roadChunkSprite.label = ROAD_CHUNK;
    roadChunkSprite.anchor.set(...anchor);
    return roadChunkSprite;
  }

  /**
   * bonus
   */
  [`reset${upperFirst(BONUS)}`](bonusSprite) {
    resetPixiObject(bonusSprite);
  }

  [`prepare${upperFirst(BONUS)}`](bonusSprite) {
    const {
      defaultProperties: {
        storage: {
          mainSceneSettings: {
            bonus: {anchor},
          },
        },
      },
    } = this;
    bonusSprite.label = BONUS;
    bonusSprite.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, BONUS);
    bonusSprite.anchor.set(...anchor);
  }

  [`create${upperFirst(BONUS)}`]() {
    const {
      defaultProperties: {
        storage: {
          mainSceneSettings: {
            bonus: {zIndex, anchor},
          },
        },
      },
    } = this;
    const texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, BONUS);
    const bonusSprite = new PIXI.Sprite(texture);
    bonusSprite.label = BONUS;
    bonusSprite.zIndex = zIndex;
    bonusSprite.anchor.set(...anchor);
    return bonusSprite;
  }

  /**
   * block
   */
  [`reset${upperFirst(BLOCK)}`](blockSprite) {
    resetPixiObject(blockSprite);
  }

  [`prepare${upperFirst(BLOCK)}`](blockSprite) {
    const {
      defaultProperties: {
        storage: {
          mainSceneSettings: {
            block: {anchor},
          },
        },
      },
    } = this;
    blockSprite.label = BLOCK;
    blockSprite.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, BLOCK);
    blockSprite.anchor.set(...anchor);
  }

  [`create${upperFirst(BLOCK)}`]() {
    const {
      defaultProperties: {
        storage: {
          mainSceneSettings: {
            block: {zIndex, anchor},
          },
        },
      },
    } = this;
    const texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, BLOCK);
    const blockSprite = new PIXI.Sprite(texture);
    blockSprite.label = BLOCK;
    blockSprite.zIndex = zIndex;
    blockSprite.anchor.set(...anchor);
    return blockSprite;
  }
}
