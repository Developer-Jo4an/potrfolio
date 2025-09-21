import BaseController from "../BaseController/BaseController";
import {isInsideRectangle} from "../../../../../shared/lib/matrix/matrix";
import {clamp} from "lodash";
import {dunkShotFactory} from "../../factory/DunkShotFactory";
import {DUNK_SHOT_STATE_MACHINE} from "../../../constants/stateMachine";
import {MAX, MIN} from "../../../../../shared/constants/range/range";
import {INSIDE_BASKET} from "../../../constants/statuses";

export default class CameraController extends BaseController {
  constructor(data) {
    super(data);
  }

  init() {

  }

  get target() {
    const {storage: {mainSceneSettings: {camera: {validRectangle}}}} = this;
    const {mainContainer, ball} = dunkShotFactory;

    const ballGlobalPosition = {x: mainContainer.view.position.x + ball.x, y: mainContainer.view.position.y + ball.y};

    const mathFunction = ballGlobalPosition?.y < (validRectangle.y + validRectangle.y + validRectangle.width) / 2 ? MIN : MAX;

    return ball.status !== INSIDE_BASKET
      ? Math[mathFunction](
        validRectangle.y - ballGlobalPosition.y,
        validRectangle.y + validRectangle.height - ballGlobalPosition.y
      )
      : validRectangle.y + validRectangle.height - ballGlobalPosition.y;
  }

  get speed() {
    const {target, storage: {mainSceneSettings: {camera: {speed, borderDistance}}}} = this;

    return clamp(Math.abs(target) / borderDistance, speed.min, speed.max);
  }

  moveCamera(mathFunction, deltaTime) {
    const {mainContainer} = dunkShotFactory;

    mainContainer.view.position.y = mainContainer.view.position.y + this.speed * deltaTime * ({
      [MIN]: 1,
      [MAX]: -1
    })[mathFunction];
  }

  updateCamera(milliseconds, deltaTime) {
    const {storage: {mainSceneSettings: {camera: {validRectangle}}}} = this;
    const {ball, mainContainer} = dunkShotFactory;

    if (!ball) return;

    const ballGlobalPosition = {x: mainContainer.view.position.x + ball.x, y: mainContainer.view.position.y + ball.y};

    const ballIsInsideCameraValidPlace = isInsideRectangle(validRectangle, ballGlobalPosition.x, ballGlobalPosition.y);

    if (ball.status === INSIDE_BASKET) {
      const targetValue = validRectangle.y + validRectangle.height;

      if (Math.abs(ballGlobalPosition.y - targetValue) > validRectangle.threshold) {
        const mathFunction = ballGlobalPosition?.y < targetValue ? MIN : MAX;
        this.moveCamera(mathFunction, deltaTime);
      }

      return;
    }

    if (!ballIsInsideCameraValidPlace) {
      const mathFunction = ballGlobalPosition?.y < (validRectangle.y + validRectangle.height / 2) ? MIN : MAX;
      this.moveCamera(mathFunction, deltaTime);
    }
  }

  update(milliseconds, deltaTime) {
    const {state} = this;

    if (!DUNK_SHOT_STATE_MACHINE[state]?.isAvailableCameraUpdate) return;

    this.updateCamera(milliseconds, deltaTime);
  }
}
