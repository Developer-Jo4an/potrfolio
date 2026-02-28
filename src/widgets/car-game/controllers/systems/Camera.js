import {System} from "@shared";

export class Camera extends System {
  updateCamera() {
    const {
      storage: {
        stage,
        mainSceneSettings: {
          camera: {trackBorderY, trackBorderX},
        },
      },
    } = this;

    const {cMatrix, view: actorView} = this.getActorInfo();

    const stagePosition = stage.toLocal(actorView.parent.toGlobal({x: cMatrix.x, y: cMatrix.y}));

    const {cMatrix: cMainContainerMatrix} = this.getMainContainerInfo();

    const diffY = stagePosition.y - trackBorderY;
    if (diffY < 0) cMainContainerMatrix.y -= diffY;

    const diffX = stagePosition.x - trackBorderX;
    if (diffX !== 0) cMainContainerMatrix.x -= diffX;
  }

  update() {
    this.updateCamera(...arguments);
  }
}
