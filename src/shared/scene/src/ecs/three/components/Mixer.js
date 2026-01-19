import {Component} from "../../core/Component";

export class Mixer extends Component {
  mixer;

  animations = {};

  constructor({mixer}) {
    super(...arguments);
    this.mixer = mixer;
  }

  destroy() {
    super.destroy();
    this.mixer = null;
    this.animations = null;
  }
}
