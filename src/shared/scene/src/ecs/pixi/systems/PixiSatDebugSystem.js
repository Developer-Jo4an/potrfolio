import {eventSubscription} from "../../../../../lib/src/events/eventListener";
import {PixiComponent} from "../components/PixiComponent";
import {SatDebugSystem} from "../../sat/systems/SatDebugSystem";
import {PixiDebugComponent} from "../components/PixiDebugComponent";

class PixiSatDebugSystem extends SatDebugSystem {
  constructor() {
    super(...arguments);

    this.createContainer();
  }

  createContainer() {
    const debugContainer = (this.debugContainer = new PIXI.Container());
    debugContainer.label = "debugContainer";
    debugContainer.zIndex = Number.MAX_VALUE;
  }

  initializationSelect() {
    const {
      storage: {stage},
      debugContainer,
    } = this;

    stage.addChild(debugContainer);
  }

  paint(entity, vertices) {
    const cPixiDebug = entity.get(PixiDebugComponent);
    const cPixi = entity.get(PixiComponent);

    if (cPixiDebug && cPixi?.pixiObject) {
      !cPixiDebug.graphics && this.initGraphics(entity, cPixiDebug, cPixi);
      this.drawPolygon(cPixiDebug, cPixi, vertices);
    }
  }

  initGraphics(entity, cPixiDebug, cPixi) {
    const graphics = (cPixiDebug.graphics = new PIXI.Graphics());
    graphics.label = cPixi.pixiObject.label ?? cPixi.uuid;

    this.addSideEffect({
      entity,
      effect: () => this.addToContainer(cPixiDebug),
    });
  }

  addToContainer(cPixiDebug) {
    const {eventBus, debugContainer} = this;
    const {graphics} = cPixiDebug;

    debugContainer.addChild(graphics);

    const clear = eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: `${PixiDebugComponent.EVENTS.REMOVE}-${cPixiDebug.type}`,
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
    const {debugContainer} = this;

    const polygonPoints = vertices.map(({x, y}) => {
      const globalPoint = cPixi.pixiObject.parent.toGlobal({x, y});
      return debugContainer.toLocal(globalPoint);
    });

    const {graphics, strokeSettings} = cPixiDebug;

    graphics
      .clear()
      .poly(polygonPoints)
      .stroke(strokeSettings ?? {width: 2, color: 0x0000ff});
  }

  reset() {
    super.reset();
    this.debugContainer.removeFromParent();
  }
}

export {PixiSatDebugSystem};
