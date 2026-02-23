import {CHARACTER} from "../../entities/character";
import {assetsManager, PIXI_SPACE, SPRITESHEET, Container} from "@shared";

export class Character extends Container {
  static clips = {
    IDLE: "idle",
    SHOOT: "shoot",
    PROPELLER: "propeller",
    JETPACK: "jetpack",
    SPRING: "spring",
    LOSE: "lose"
  };

  createAsset() {
    const asset = (this.asset = new PIXI.Container());
    asset.label = CHARACTER;

    this.createViews();
    this.setProperties();
  }

  createViews() {
    const {asset} = this;
    const {animations} = assetsManager.getAssetFromSpace(PIXI_SPACE, SPRITESHEET, "character");

    for (const key in Character.clips) {
      const clipName = Character.clips[key];
      const clip = new PIXI.AnimatedSprite(animations[clipName]);
      clip.label = clipName;
      asset.addChild(clip);
    }
  }

  setProperties() {
    const {
      asset,
      defaultProperties: {
        storage: {
          mainSceneSettings: {
            clips: {character}
          }
        }
      }
    } = this;

    asset.children.forEach(clip => {
      const {label} = clip;
      const {loop = false, speed = 1, anchor = {x: 0.5, y: 0.5}, startFrame = 0} = character[label] ?? {};

      clip.anchor.set(anchor.x, anchor.y);
      clip.zIndex = Number(label === Character.clips.IDLE);
      clip.visible = label === Character.clips.IDLE;
      clip.scale.set(Number(label === Character.clips.IDLE));

      clip.loop = loop;
      clip.animationSpeed = speed;
      clip.gotoAndStop(startFrame);
    });
  }

  prepare() {
    this.setProperties();
    super.prepare();
  }

  reset() {
    this.setProperties();
    super.reset();
  }
}
