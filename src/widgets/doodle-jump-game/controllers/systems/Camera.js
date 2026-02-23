import {System} from "@shared"

export class Camera extends System {
  moveCamera({ticks}) {
    const {
      storage: {
        mainSceneSettings: {
          camera: {clamp},
        },
      },
    } = this;

    const {view: characterView} = this.getCharacterInfo();
    const {cMatrix: cMainContainerMatrix} = this.getMainContainerInfo();

    const globalPosition = characterView.getGlobalPosition(undefined, ticks !== 1);

    const min = global.innerHeight * clamp.min;
    const max = global.innerHeight * clamp.max;

    if (globalPosition.y < min) {
      const diff = min - globalPosition.y;
      cMainContainerMatrix.y += diff;
    }

    if (globalPosition.y > max) {
      const diff = globalPosition.y - max;
      cMainContainerMatrix.y -= diff;
    }
  }

  update() {
    this.moveCamera(...arguments);
  }
}
