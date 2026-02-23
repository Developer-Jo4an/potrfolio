import {Generator} from "./Generator";
import {lerp, Entity} from "@shared";
import {isArray, isFinite, isObject} from "lodash";
import {move} from "../../tweens/move";
import {PLATFORM} from "../../entities/platform";
import {Tweens} from "../../constants/tweens";
import {GAME_SIZE} from "../../constants/game";

export class Platform extends Generator {
  generate() {
    const {eventBus} = this;

    const ePlatform = new Entity({eventBus, type: PLATFORM}).init();

    this.prepareView(ePlatform, ...arguments);
    this.prepareMatrix(ePlatform, ...arguments);
    this.prepareCollider(ePlatform, ...arguments);
    this.prepareCombination(ePlatform, ...arguments);
    this.prepareCounter(ePlatform, ...arguments);

    return ePlatform;
  }

  prepareView(ePlatform, {texture, size: {width, height}}) {
    const {system} = this;
    const {cPixi, cMatrix} = system.getPlatformInfo(ePlatform);

    const view = (cPixi.pixiObject = system.getAsset(ePlatform, PLATFORM, {extraData: {name: texture}}));

    const scaleX = (cMatrix.scaleX = width / view.width);
    const scaleY = (cMatrix.scaleY = height / view.height);

    view.scale.set(scaleX, scaleY);
  }

  prepareMatrix(ePlatform, {x, y, yOffset, size: {width}}) {
    const {system} = this;
    const {cMatrix, view} = system.getPlatformInfo(ePlatform);

    const totalY = y + yOffset;

    if (isFinite(x)) {
      this.setPosition({min: 0, max: 1, y: totalY, width, progress: x, matrix: cMatrix, view});
      return;
    }

    if (isArray(x)) {
      const [min, max] = x;
      this.setPosition({min, max, y: totalY, width, matrix: cMatrix, view});
      return;
    }

    if (isObject(x)) {
      const {min, max, speed} = x;

      this.setPosition({min, max, y: totalY, width, matrix: cMatrix, view});

      const {start, end} = this.getInterval(min, max, width);

      const points = [
        {x: start, y: cMatrix.y},
        {x: end, y: cMatrix.y},
        {x: cMatrix.x, y: cMatrix.y}
      ];

      const {tween, promise} = move({target: cMatrix, vars: {points, speed}});

      system.addTween(ePlatform, tween, promise, Tweens.MOVE);
    }
  }

  getInterval(min, max, width) {
    const borderLeft = width / 2;
    const borderRight = GAME_SIZE.width - width / 2;

    const worldWidth = borderRight - borderLeft;

    const minPadding = worldWidth * min;
    const maxPadding = worldWidth - worldWidth * max;

    const start = borderLeft + minPadding;
    const end = borderRight - maxPadding;

    return {start, end};
  }

  setPosition({min, max, y, width, matrix, view, progress = Math.random()}) {
    const {start, end} = this.getInterval(min, max, width);

    const x = lerp(start, end, progress);

    matrix.x = view.x = x;
    matrix.y = view.y = y;

    return {x, y};
  }

  prepareCollider(ePlatform, {size: {width, height}, isTrackCollision}) {
    const {system} = this;
    const {cMatrix, cCollider} = system.getPlatformInfo(ePlatform);
    cCollider.collider = system.createCollider(cMatrix.x, cMatrix.y, width, height);
    cCollider.isTrackCollision = isTrackCollision;
  }

  prepareCombination(ePlatform, {combinationId}) {
    const {system} = this;
    const {cCombination} = system.getPlatformInfo(ePlatform);
    cCombination.combinationId = combinationId;
  }

  prepareCounter(ePlatform, {count}) {
    const {system} = this;
    const {cCounter} = system.getPlatformInfo(ePlatform);
    cCounter.max = count;
  }
}
