import Factory from "../../../shared/scene/factory/Factory";
import {upperFirst} from "lodash";
import resetPixiObject from "../utils/helpers/resetPixiObject";
import global from "../../../shared/constants/global/global";
import {CHARACTER} from "../constants/entities/character";
import {MAIN_CONTAINER} from "../constants/entities/mainContainer";
import {ROAD_CHUNK} from "../constants/entities/roadChunk";
import {BONUS} from "../constants/entities/bonus";
import {SPIKE} from "../constants/entities/spike";
import {assetsManager} from "../../../shared/scene/assets/AssetsManager";
import {PIXI_SPACE, TEXTURE} from "../../../shared/scene/constants/loaders/assetsTypes";

export default class CarFactory extends Factory {
  static METHODS = {
    create: "create",
    prepare: "prepare",
    reset: "reset"
  };

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
    if (item)
      this[CarFactory.createMethod(CarFactory.METHODS.prepare, type)]?.(item, data);
    else
      item = this.createItem(type, data);
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
    const {defaultProperties: {storage: {mainSceneSettings: {character: {anchor, zIndex}}}}} = this;
    characterSprite.label = CHARACTER;
    characterSprite.anchor.set(...anchor);
    characterSprite.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, CHARACTER);
    characterSprite.zIndex = zIndex;
  }

  [`create${upperFirst(CHARACTER)}`]() {
    const {defaultProperties: {storage: {mainSceneSettings: {character: {anchor, zIndex}}}}} = this;
    const texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, CHARACTER);
    const characterSprite = new global.PIXI.Sprite(texture);
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
    const mainContainer = new global.PIXI.Container();
    mainContainer.label = MAIN_CONTAINER;
    return mainContainer;
  }

  /**
   * roadChunk
   */
  [`reset${upperFirst(ROAD_CHUNK)}`](roadChunkSprite) {
    resetPixiObject(roadChunkSprite);
  }

  [`prepare${upperFirst(ROAD_CHUNK)}`](roadChunkSprite) {
    const {defaultProperties: {storage: {mainSceneSettings: {roadChunks: {anchor, tileScale}}}}} = this;
    roadChunkSprite.label = ROAD_CHUNK;
    roadChunkSprite.tileScale.set(...tileScale);
    roadChunkSprite.mask.label = ROAD_CHUNK;
    roadChunkSprite.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, ROAD_CHUNK);
    roadChunkSprite.anchor.set(...anchor);
  }

  [`create${upperFirst(ROAD_CHUNK)}`]() {
    const {defaultProperties: {storage: {mainSceneSettings: {roadChunks: {anchor, tileScale}}}}} = this;
    const texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, ROAD_CHUNK);
    const roadChunkSprite = new global.PIXI.TilingSprite(texture);
    roadChunkSprite.label = ROAD_CHUNK;
    roadChunkSprite.tileScale.set(...tileScale);
    const mask = roadChunkSprite.mask = new global.PIXI.Graphics();
    mask.label = ROAD_CHUNK;
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
    const {defaultProperties: {storage: {mainSceneSettings: {bonus: {anchor}}}}} = this;
    bonusSprite.label = BONUS;
    bonusSprite.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, BONUS);
    bonusSprite.anchor.set(...anchor);
  }

  [`create${upperFirst(BONUS)}`]() {
    const {defaultProperties: {storage: {mainSceneSettings: {bonus: {zIndex, anchor}}}}} = this;
    const texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, BONUS);
    const bonusSprite = new global.PIXI.Sprite(texture);
    bonusSprite.label = BONUS;
    bonusSprite.zIndex = zIndex;
    bonusSprite.anchor.set(...anchor);
    return bonusSprite;
  }

  /**
   * spike
   */
  [`reset${upperFirst(SPIKE)}`](spikeSprite) {
    resetPixiObject(spikeSprite);
  }

  [`prepare${upperFirst(SPIKE)}`](spikeSprite) {
    const {defaultProperties: {storage: {mainSceneSettings: {spike: {anchor}}}}} = this;
    spikeSprite.label = SPIKE;
    spikeSprite.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, SPIKE);
    spikeSprite.anchor.set(...anchor);
  }

  [`create${upperFirst(SPIKE)}`]() {
    const {defaultProperties: {storage: {mainSceneSettings: {spike: {zIndex, anchor}}}}} = this;
    const texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, SPIKE);
    const spikeSprite = new global.PIXI.Sprite(texture);
    spikeSprite.label = SPIKE;
    spikeSprite.zIndex = zIndex;
    spikeSprite.anchor.set(...anchor);
    return spikeSprite;
  }
}
