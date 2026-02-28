import {eventSubscription} from "../../../../../lib/src/events/eventListener";
import {PixiComponent} from "../components/PixiComponent";
import {SatDebugSystem} from "../../sat/systems/SatDebugSystem";
import {PixiDebug} from "../components/PixiDebug";

class PixiSatDebugSystem extends SatDebugSystem {
  paint(entity, vertices) {
    const cPixiDebug = entity.get(PixiDebug);
    const cPixi = entity.get(PixiComponent);

    if (cPixiDebug && cPixi?.pixiObject) {
      !cPixiDebug.graphics && this.initGraphics(entity, cPixiDebug, cPixi);
      this.drawPolygon(cPixiDebug, cPixi, vertices);
    }
  }

  initGraphics(entity, cPixiDebug, cPixi) {
    const graphics = (cPixiDebug.graphics = new PIXI.Graphics());
    graphics.zIndex = Number.MAX_VALUE;
    graphics.label = cPixi.pixiObject.label ?? cPixi.uuid;

    this.addSideEffect({
      entity,
      effect: () => this.addToContainer(cPixiDebug),
    });
  }

  addToContainer(cPixiDebug) {
    const {
      eventBus,
      storage: {stage},
    } = this;
    const {graphics} = cPixiDebug;

    stage.addChild(graphics);

    const clear = eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: `${PixiDebug.EVENTS.REMOVE}-${cPixiDebug.type}`,
          callback: ({data: {component}}) => {
            if (component === cPixiDebug) {
              component.graphics.destroy();
              component.graphics = null;
              clear();
            }
          },
        },
      ],
    });

    return () => {
      graphics.destroy();
      cPixiDebug.graphics = null;
      clear();
    };
  }

  drawPolygon(cPixiDebug, cPixi, vertices) {
    const {
      storage: {stage},
    } = this;

    const polygonPoints = vertices.map(({x, y}) => {
      const globalPoint = cPixi.pixiObject.parent.toGlobal({x, y});
      return stage.toLocal(globalPoint);
    });

    const {graphics, strokeSettings} = cPixiDebug;

    graphics
      .clear()
      .poly(polygonPoints)
      .stroke(strokeSettings ?? {width: 2, color: 0x0000ff});
  }
}

export {PixiSatDebugSystem};
