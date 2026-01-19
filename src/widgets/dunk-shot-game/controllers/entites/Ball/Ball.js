import {BasePhysicsEntity} from "../base/BasePhysicsEntity";
import {isFunction, upperFirst, cloneDeep} from "lodash";
import {assetsManager, PIXI_SPACE, TEXTURE} from "@shared";
import {FREE, TO_DOWN} from "../../../constants/statuses";
import {COLLISION_FILTERS} from "../../../constants/collision";
import {BALL_2D} from "../../../config/preload";

export class Ball extends BasePhysicsEntity {

  _status = FREE; // free | toUp | toDown | insideBasket | damage | protected

  savedData = {
    prevAngle: null,
    prevPosition: null
  };

  constructor(data) {
    super(data);

    this.initEvents();
    this.init();
  }

  get status() {
    return this._status;
  }

  set status(status) {
    this._status = status;
    this.onStatusChanged();
  }

  initEvents() {
  }

  init() {
    this.initBody();
    this.initView();
  }

  initBody() {
    const {storage: {mainSceneSettings: {ball: {radius, physicalSettings}}}} = this;

    const body = this.body = Matter.Bodies.circle(
      0, 0, radius,
      {
        ...cloneDeep(physicalSettings),
        collisionFilter: cloneDeep(COLLISION_FILTERS.BALL)
      }
    );
  }

  initView() {
    const {groups, storage: {mainSceneSettings: {ball}}} = this;

    const view = this.view ??= new PIXI.Sprite();
    view.label = "ball";
    view.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, BALL_2D);
    groups.middle.attach(view);
    view.anchor.set(0.5);
    view.scale.set(1);
    view.alpha = 1;
    view.tint = 0xFFFFFF;
    view.scale.set(ball.radius * 2 / view.width, ball.radius * 2 / view.height);
  }

  onStatusChanged() {
    const {status} = this;

    this[`on${upperFirst(status)}`]?.();
  }

  onToUp() {
    const {body} = this;

    this.isGravity = true;
    body.collisionFilter = cloneDeep(COLLISION_FILTERS.BALL);
  }

  onToDown() {
    const {body} = this;

    this.isGravity = true;
    body.collisionFilter = cloneDeep(COLLISION_FILTERS.BALL);
  }

  onFree() {
    const {body} = this;

    this.isGravity = true;
    body.collisionFilter = cloneDeep(COLLISION_FILTERS.BALL);
  }

  onInsideBasket() {
    const {angle, body} = this;

    this.isGravity = false;
    this.savedData.lastAngle = angle;
    body.collisionFilter = cloneDeep(COLLISION_FILTERS.BALL);
  }

  onDamage() {
    const {body} = this;

    body.collisionFilter = cloneDeep(COLLISION_FILTERS.DAMAGE);
  }

  onProtected() {
    const {body} = this;

    body.collisionFilter = cloneDeep(COLLISION_FILTERS.PROTECTED);
  }

  handleStatus() {
    const {status} = this;

    const callbackKey = `handle${upperFirst(status)}`;

    if (isFunction(this[callbackKey]))
      this[callbackKey]();
    else
      this.savedData.prevPosition = null;
  }

  handleToUp() {
    const {position} = this;

    if (!this.savedData.prevPosition)
      this.savedData.prevPosition = {x: position.x, y: position.y};

    if (position.y > this.savedData.prevPosition?.y)
      this.status = TO_DOWN;

    this.savedData.prevPosition = {x: position.x, y: position.y};
  }

  addToSpaces() {
    this.addToStage();
    this.addToWorld();
  }

  updateMatrix() {
    const {view, body} = this;

    const {position, angle} = body;

    view.position.set(position.x, position.y);
    view.rotation = angle;
  }

  update() {
    this.updateMatrix();
    this.handleStatus();
  }

  delete() {
    const {view} = this;
    view.parent?.removeChild?.(view);
    super.delete();
  }

  reset() {
    this.position = {x: 0, y: 0};
    this.angle = 0;
    this.isGravity = false;
    this.savedData = {prevAngle: null, prevPosition: null};
    this.delete();
  }

  activate() {
    this.initView();
  }
}
