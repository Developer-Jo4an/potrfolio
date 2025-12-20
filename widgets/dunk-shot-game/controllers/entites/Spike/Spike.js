import BasePhysicsEntity from "../base/BasePhysicsEntity";
import {copy} from "../../../../../shared/lib/copy/copy";
import {upperFirst} from "lodash";
import {PIXI_SPACE, TEXTURE} from "../../../../../shared/scene/constants/loaders/assetsTypes";
import {COLLISION_FILTERS} from "../../../constants/collision";
import {assetsManager} from "../../../../../shared/scene/assets/AssetsManager";
import {INACTIVE} from "../../../constants/statuses";

export default class Spike extends BasePhysicsEntity {

  _status = INACTIVE;

  constructor(data) {
    super(data);

    this.init();
  }

  get status() {
    return this._status;
  }

  set status(status) {
    this._status = status;
    this.onStatusChanged();
  }

  init() {
    this.initBody();
    this.initView();
  }

  initBody() {
    const {storage: {mainSceneSettings: {spike: {body: {width, height, physicalSettings}}}}} = this;

    const body = this.body = Matter.Bodies.rectangle(
      0, 0, width, height,
      {
        ...copy(physicalSettings),
        collisionFilter: copy(COLLISION_FILTERS.SPIKE)
      }
    );
  }

  initView() {
    const {type, groups, storage: {mainSceneSettings: {spike: {textureTypes, view: {width, height}}}}} = this;

    const view = this.view ??= new PIXI.Sprite();
    view.label = type;
    groups.back.attach(view);
    view.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, textureTypes[type]);
    view.scale.set(1);
    view.anchor.set(0.5);
    view.scale.set(Math.min(width / view.width, height / view.height));
  }

  addToSpaces() {
    this.addToStage();
    this.addToWorld();
  }

  onStatusChanged() {
    const {status} = this;

    this[`on${upperFirst(status)}`]?.();
  }

  onActive() {
    const {body} = this;
    body.collisionFilter = copy(COLLISION_FILTERS.SPIKE);
  }

  onInactive() {
    const {body} = this;
    body.collisionFilter = copy(COLLISION_FILTERS.INACTIVE);
  }

  updateMatrix() {
    const {view, body} = this;

    const {position, angle} = body;

    view.position.set(position.x, position.y);
    view.rotation = angle;
  }

  update() {
    this.updateMatrix();
  }

  delete() {
    const {view} = this;
    view.parent?.removeChild?.(view);
    super.delete();
  }

  reset() {
    this.delete();
    this.position = {x: 0, y: 0};
    this.positionLabel = null;
    this.status = INACTIVE;
    this.row = null;
  }

  activate(data) {
    this.type = data.type;
    this.speed = data.speed;
    this.row = data.row;
    this.initView();
  }
}
