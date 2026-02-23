import {BallController} from "./controllers/BallController";
import {MapEntitiesController} from "./controllers/MapEntitiesController";
import {BaseGameplayController} from "./BaseGameplayController";
import {AimController} from "./controllers/AimController";
import {BoostersController} from "./controllers/BoostersController";
import {cloneDeep} from "lodash";
import {WHITE, addControllerStateHandler} from "@shared";
import {COLLISION_FILTERS} from "../../constants/collision";
import {DUNK_SHOT_TWEEN} from "../../constants";
import {STATE_MACHINE} from "../../constants/stateMachine";
import {factory} from "../../factory/Factory";
import {VISIBLE} from "../../constants/modes";
import {TO_DOWN} from "../../constants/statuses";
import {animationPlayer} from "../../animations/AnimationPlayer";

export class GameplayController extends BaseGameplayController {
  static CONTROLLERS = [BallController, MapEntitiesController, AimController, BoostersController];

  controllers = [];

  throwData = {startData: null, currentData: null};

  idealThrowData = {collisions: []};

  constructor(data) {
    super(data);

    return addControllerStateHandler(this, STATE_MACHINE);
  }

  init() {
    const {
      eventBus,
      renderer,
      canvas,
      stage,
      storage,
      state,
      engine,
      world,
      app,
      groups,
      controllers,
      throwData,
      idealThrowData,
      config,
      decorators,
      gameData,
    } = this;

    const generalData = {
      eventBus,
      renderer,
      decorators,
      canvas,
      stage,
      storage,
      state,
      engine,
      world,
      app,
      groups,
      throwData,
      idealThrowData,
      config,
      gameData,
    };

    GameplayController.CONTROLLERS.forEach((ControllerClass) => {
      const controller = new ControllerClass(generalData);
      controller.initEvents?.();
      controllers.push(controller);
    });

    controllers.forEach((controller) => controller.init?.());
  }

  async fellSelect() {
    const {
      storage: {
        mainSceneSettings: {
          states: {fell},
        },
      },
    } = this;
    const {activeBasket, nextBasket, ball} = factory;

    this.resetThrowData();
    this.resetIdealThrowData();
    this.deleteDamageAnimation();

    activeBasket.mode = VISIBLE;
    ball.status = TO_DOWN;
    ball.body.collisionFilter = cloneDeep(COLLISION_FILTERS.PREPARE);
    ball.angle = 0;
    ball.position = {x: activeBasket.x + fell.showingOffset.x, y: activeBasket.y + fell.showingOffset.y};
    ball.isGravity = false;

    this.clearSpecificBehaviour();

    await animationPlayer.ballShowAnimation(ball);

    await animationPlayer.basketDefaultAnimation(activeBasket, {
      rotation: true,
      scale: {isImmediate: true},
      alpha: true,
    });

    ball.isGravity = true;

    await animationPlayer.basketNextAnimation(nextBasket);
  }

  deleteDamageAnimation() {
    const {
      ball: {_factoryUUID, view},
    } = factory;

    const damageAnimation = gsap.localTimeline.getTweenByNamespaceAndId(DUNK_SHOT_TWEEN, `ballDamage${_factoryUUID}`);

    if (damageAnimation) {
      view.tint = WHITE;
      damageAnimation.delete(DUNK_SHOT_TWEEN);
    }
  }

  update(milliseconds, deltaTime) {
    const {controllers} = this;
    controllers.forEach((controller) => controller.update(milliseconds, deltaTime));
  }

  resetThrowData() {
    const {throwData} = this;
    throwData.startData = null;
    throwData.currentData = null;
  }

  resetIdealThrowData() {
    const {idealThrowData} = this;
    idealThrowData.collisions.length = 0;
  }

  reset() {
    this.resetThrowData();
    this.resetIdealThrowData();
  }
}
