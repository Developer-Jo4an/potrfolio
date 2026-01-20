import {Resize} from "../../resize/Resize";

export class PixiResize extends Resize {
  onResized() {
    const {renderer, $container} = this;
    if ($container === global) {
      const {innerWidth, innerHeight} = global;
      renderer.resize(innerWidth, innerHeight);
    } else {
      const {clientWidth, clientHeight} = $container;
      renderer.resize(clientWidth, clientHeight);
    }

    super.onResized();
  }
}
