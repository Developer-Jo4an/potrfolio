import BaseGameplayController from "../BaseGameplayController";
import {createArrayWithMap} from "../../../../../../shared/lib/array/createArrayWithMap";
import {dunkShotFactory} from "../../../factory/DunkShotFactory";
import {INSIDE_BASKET} from "../../../../constants/statuses";
import {LEFT, RIGHT} from "../../../../../../shared/constants/directions/directions";

export default class AimController extends BaseGameplayController {

  cashedData = {
    prevPositions: {}
  };

  constructor(data) {
    super(data);
  }

  init() {
    this.initShadowWorld();
    this.initShadowWalls();
    this.initShadowBall();
  }

  initLevelSelect() {
    const aim = dunkShotFactory.createItem("aim");
    aim.addToSpaces();
  }

  initShadowWorld() {
    const shadowEngine = this.shadowEngine = Matter.Engine.create();
    const shadowWorld = this.shadowWorld = shadowEngine.world;
  }

  initShadowWalls() {
    const {shadowEngine, shadowWorld} = this;

    [LEFT, RIGHT].forEach(direction => {
      const wall = dunkShotFactory.createItem("shadowWall", {direction, engine: shadowEngine, world: shadowWorld});
      wall.addToSpaces();
    });
  }

  initShadowBall() {
    const {shadowEngine, shadowWorld} = this;

    const shadowBall = dunkShotFactory.createItem("shadowBall", {engine: shadowEngine, world: shadowWorld});
    shadowBall.isGravity = false;
    shadowBall.addToSpaces();
  }


  throwShadowBall(angle, power) {
    const {storage: {mainSceneSettings: {throw: throwSettings}}} = this;
    const {ball, shadowBall} = dunkShotFactory;

    shadowBall.isGravity = false;
    shadowBall.position = {x: ball.x, y: ball.y};
    shadowBall.angle = ball.angle;

    const formattedAngle = angle + (Math.PI * 3 / 2);
    const speed = power * throwSettings.power.linear;

    Matter.Body.applyForce(shadowBall.body, shadowBall.position, {
      x: Math.cos(formattedAngle) * speed,
      y: Math.sin(formattedAngle) * speed
    });
    Matter.Body.setAngularVelocity(
      shadowBall.body,
      (angle > 0 ? -1 : 1) * (power * throwSettings.power.angular)
    );
    shadowBall.isGravity = true;
  }

  getAimPointPositions(angle, power) {
    const {
      shadowEngine,
      cashedData: {prevPositions},
      storage: {mainSceneSettings: {aim: {points: {updateCount, count}}, throw: throwSettings}}
    } = this;
    const {shadowBall} = dunkShotFactory;

    angle = +angle.toFixed(throwSettings.accuracy);
    power = +power.toFixed(throwSettings.accuracy);

    if (prevPositions.key === `${angle}-${power}`)
      return prevPositions.positions;

    this.throwShadowBall(angle, power);

    const positions = createArrayWithMap(updateCount, () => {
      Matter.Engine.update(shadowEngine);
      return {x: shadowBall.position.x, y: shadowBall.position.y};
    });

    const aimPositions = positions.reduce((acc, position) => {
      acc.counter += 1;
      if (acc.counter >= updateCount / count) {
        acc.positions.push(position);
        acc.counter = 0;
      }
      return acc;
    }, {positions: [], counter: 0}).positions;

    prevPositions.key = `${angle}-${power}`;
    prevPositions.positions = aimPositions;

    return aimPositions;
  }

  updateAim() {
    const {throwData} = this;
    const {ball, aim} = dunkShotFactory;

    if (
      !Object.values(throwData).every(Boolean)
      ||
      !throwData?.currentData?.isCanThrow
      ||
      ball.status !== INSIDE_BASKET
    ) {
      aim.setProperties();
      return;
    }

    const {currentData: {angle, stretchMultiplier}} = throwData;

    const positions = this.getAimPointPositions(angle, stretchMultiplier);
    aim.setProperties(stretchMultiplier, positions);
  }

  update() {
    this.updateAim();
  }

  reset() {

  }
}
