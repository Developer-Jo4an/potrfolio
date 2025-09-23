import BasePhysicsEntity from "../base/BasePhysicsEntity";
import {upperFirst} from "lodash";
import {copy} from "../../../../../shared/lib/copy/copy";
import {getIsDebug} from "../../../../../shared/lib/debug/debug";
import {PIXI_SPACE, TEXTURE} from "../../../../../shared/scene/constants/loaders/assetsTypes";
import {dunkShotFactory} from "../../factory/DunkShotFactory";
import {COLLISION_FILTERS} from "../../../constants/collision";
import {INACTIVE} from "../../../constants/statuses";
import {VISIBLE} from "../../../constants/modes";
import {assetsManager} from "../../../../../shared/scene/assets/AssetsManager";
import {RED, WHITE} from "../../../../../shared/constants/colors/colors";
import global from "../../../../../shared/constants/global/global";

export default class Basket extends BasePhysicsEntity {

  _position = {x: 0, y: 0};

  _angle = 0;

  _status = INACTIVE; // active | inactive | next | hidden

  _mode = VISIBLE; // visible | hidden

  debug = {
    circles: []
  };

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

  get mode() {
    return this._mode;
  }

  set mode(status) {
    this._mode = status;
    this.onModeChanged();
  }

  get position() {
    return this._position;
  }

  set position({x = this.position.x, y = this.position.y}) {
    const {angle} = this;

    this._position = {x, y};

    this.updateCirclesLocation(x, y, angle);
  }

  get angle() {
    return this._angle;
  }

  set angle(angle) {
    const {position: {x, y}} = this;

    this._angle = angle;

    this.updateCirclesLocation(x, y, angle);
  }

  init() {
    this.initBody();
    this.initView();
  }

  initBody() {
    const {storage: {mainSceneSettings: {basket: {circles: circlesSettings}}}} = this;

    const body = this.body = global.Matter.Composite.create();

    const circles = this.circles = new Array(circlesSettings.array.length).fill(0).map(((_, index) => {
      const {extraProps} = circlesSettings.array[index];
      return global.Matter.Bodies.circle(0, 0, circlesSettings.radius, {wrapper: this, ...extraProps});
    }));

    global.Matter.Composite.add(body, circles);
  }

  initView() {
    const {type} = this;

    const view = this.view ??= new global.PIXI.Container();
    view.name = type;
    view.sortableChildren = true;
    view.alpha = 1;

    this.initBasketGridBack();
    this.initBasketBack();
    this.initBasketGridFront();
    this.initBasketFront();
  }

  initBasketGridBack() {
    const {
      view,
      groups,
      storage: {mainSceneSettings: {basket: {gridBack}}}
    } = this;

    const basketGridBackTexture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, "basketGridBack");

    const basketGridBack = this.basketGridBack ??= new global.PIXI.Sprite();
    basketGridBack.name = "basketGridBack";
    basketGridBack.texture = basketGridBackTexture;
    groups.back.attach(basketGridBack);
    basketGridBack.scale.set(1);
    basketGridBack.anchor.set(0.5, 0);
    basketGridBack.alpha = 1;
    basketGridBack.scale.set(gridBack.width / basketGridBack.width);
    basketGridBack.position.set(
      gridBack.positionMultiplier.x * basketGridBack.width,
      gridBack.positionMultiplier.y * basketGridBack.height
    );
    view.addChild(basketGridBack);
  }

  initBasketBack() {
    const {
      view,
      type,
      groups,
      storage: {mainSceneSettings: {basket: {back, textureTypes: basketTypes}}}
    } = this;

    const textureType = basketTypes[type];

    const basketBackTexture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, `basket${textureType}Back`);
    const basketBack = this.basketBack ??= new global.PIXI.Sprite();
    basketBack.name = "basketBack";
    basketBack.texture = basketBackTexture;
    groups.back.attach(basketBack);
    basketBack.scale.set(1);
    basketBack.anchor.set(0.5, 0.75);
    basketBack.alpha = 1;
    basketBack.scale.set(back.width / basketBack.width);
    view.addChild(basketBack);
  }

  initBasketGridFront() {
    const {
      view,
      type,
      groups,
      storage: {mainSceneSettings: {basket: {gridFront, textureTypes: basketTypes}}}
    } = this;

    const textureType = basketTypes[type];

    const basketGridFrontTexture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, `basket${textureType}GridFront`);
    const basketGridFront = this.basketGridFront ??= new global.PIXI.Sprite();
    basketGridFront.name = "basketGridFront";
    basketGridFront.texture = basketGridFrontTexture;
    groups.front.attach(basketGridFront);
    basketGridFront.scale.set(1);
    basketGridFront.anchor.set(0.5, 0);
    basketGridFront.alpha = 1;
    basketGridFront.scale.set(gridFront.width / basketGridFront.width);
    view.addChild(basketGridFront);
  }

  initBasketFront() {
    const {
      view,
      type,
      groups,
      storage: {mainSceneSettings: {basket: {front, textureTypes: basketTypes}}}
    } = this;

    const textureType = basketTypes[type];

    const basketFront = this.basketFront ??= new global.PIXI.Sprite();
    basketFront.name = "basketFront";
    basketFront.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, `basket${textureType}Front`);
    groups.front.attach(basketFront);
    basketFront.scale.set(1);
    basketFront.anchor.set(0.5, 0.25);
    basketFront.alpha = 1;
    basketFront.scale.set(front.width / basketFront.width);
    view.addChild(basketFront);
  }

  updateCirclesLocation(x, y, angle) {
    const {view, body: {bodies}, storage: {mainSceneSettings: {basket: {circles: circlesSettings}}}} = this;

    bodies.forEach((circle, index) => {
      const {angle: offsetAngle, distanceMultiplier} = circlesSettings.array[index];

      const newX = x + (Math.cos(offsetAngle + angle) * (circlesSettings.distanceBetween * distanceMultiplier));
      const newY = y + (Math.sin(offsetAngle + angle) * (circlesSettings.distanceBetween * distanceMultiplier));

      global.Matter.Body.setPosition(circle, {x: newX, y: newY});
    });

    view.position.set(x, y);
    view.rotation = angle;
  }

  addToSpaces() {
    const {body, view} = this;

    this.addToStage(view);
    this.addToWorld(body);
  }

  onStatusChanged() {
    const {status} = this;

    this[`on${upperFirst(status)}`]?.();
  }

  onInactive() {
    const {circles} = this;
    circles.forEach(circle => circle.collisionFilter = copy(COLLISION_FILTERS.INACTIVE));
  }

  onActive() {
    const {circles} = this;
    circles.forEach(circle => circle.collisionFilter = copy(COLLISION_FILTERS.ACTIVE));
  }

  onNext() {
    const {circles} = this;
    circles.forEach(circle => circle.collisionFilter = copy(COLLISION_FILTERS.NEXT));
  }

  onModeChanged() {
    const {mode} = this;

    this[`on${upperFirst(mode)}`]?.();
  }

  onHidden() {
    const {circles} = this;

    circles.forEach(circle => circle.collisionFilter = copy(COLLISION_FILTERS.INACTIVE));
  }

  onVisible() {
    const {circles} = this;

    circles.forEach(circle => circle.collisionFilter = copy(COLLISION_FILTERS.ACTIVE));
  }

  updateDebug() {
    const {
      debug,
      groups,
      body: {bodies},
      order,
      storage: {mainSceneSettings: {basket: {circles: circlesSettings}}}
    } = this;

    const {mainContainer} = dunkShotFactory;

    bodies.forEach(({position, label}, index) => {
      const debugCircle = debug.circles[index] ??= new global.PIXI.Graphics();
      groups.front.addChild(debugCircle);
      debugCircle.zIndex = 1;
      debugCircle.name = `basketDebug:${order}-${label}`;

      debugCircle
      .clear()
      .beginFill(({basket: WHITE, basketSensor: RED})[label])
      .drawCircle(position.x, position.y, circlesSettings.radius)
      .endFill();

      mainContainer.view.addChild(debugCircle);
    });
  }

  update() {
    getIsDebug() && this.updateDebug();
  }

  delete() {
    const {view} = this;
    view.parent?.removeChild?.(view);
    super.delete();
  }

  reset() {
    this.delete();
    this.position = {x: 0, y: 0};
    this.angle = 0;
    this.status = INACTIVE;
    this.mode = VISIBLE;
    this.positionLabel = null;
    this.row = null;
    this.order = null;
    this.isLast = null;
  }

  activate(data) {
    this.type = data.type;
    this.speed = data.speed;
    this.initView();
  }
}
