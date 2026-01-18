import BaseMouseTrailController from "./BaseMouseTrailController";
import {cubicInterpolation} from "../../lib/cubicInterpolation";
import eventSubscription from "../../../../lib/src/events/eventListener";
import getEventPosition from "../../../../lib/src/events/eventPosition";
import {MOVE} from "../../../../constants/src/events/eventsNames";

export default class MouseTrailController extends BaseMouseTrailController {

  clearActivate = null;

  constructor() {
    super();

    this.onMove = this.onMove.bind(this);
  }

  activate() {
    super.activate();

    const {
      historyX, historyY,
      historySize, ropeSize,
      points,
      trailTexture,
      stage
    } = this;

    this.clearActivate = eventSubscription({
      callbacksBus: [{
        event: MOVE, callback: e => {
          const {x, y} = getEventPosition(e);

          const {clearActivate} = this;

          if (!this.mousePosition)
            this.mousePosition = {x, y};

          const {mousePosition} = this;

          historyX.length = 0;
          historyY.length = 0;

          for (let i = 0; i < historySize; i++) {
            historyX.push(mousePosition.x);
            historyY.push(mousePosition.y);
          }

          for (let i = 0; i < ropeSize; i++) {
            const cashedPoint = points[i];

            if (cashedPoint) {
              cashedPoint.x = mousePosition.x;
              cashedPoint.y = mousePosition.y;
            } else
              points.push(new PIXI.Point(mousePosition.x, mousePosition.y));
          }

          const rope = this.rope ??= new PIXI.MeshRope({texture: trailTexture, points});
          rope.blendmode = "add";
          stage.addChild(rope);

          this.startUpdate();

          clearActivate?.();
          this.clearActivate = null;
        }
      }]
    });
  }

  deactivate() {
    super.deactivate();

    const {renderer, stage, historyX, historyY, rope, clearActivate} = this;

    clearActivate?.();
    this.clearActivate = null;

    stage.removeChild(rope);

    renderer.render(stage);

    historyX.length = 0;
    historyY.length = 0;

    this.stopUpdate();
  }

  update() {
    const {
      historyX, historyY,
      mousePosition,
      ropeSize, historySize,
      points
    } = this;

    historyX.pop();
    historyX.unshift(mousePosition.x);
    historyY.pop();
    historyY.unshift(mousePosition.y);

    for (let i = 0; i < ropeSize; i++) {
      const point = points[i];
      point.x = cubicInterpolation(historyX, (i / ropeSize) * historySize);
      point.y = cubicInterpolation(historyY, (i / ropeSize) * historySize);
    }
  }
}

