import Component from "../../../core/Component";

export default class Matrix3Component extends Component {
  x = 0;

  y = 0;

  rotation = 0;

  scaleX = 1;

  scaleY = 1;

  skewX = 0;

  skewY = 0;

  constructor({x = 0, y = 0, scaleX = 1, scaleY = 1, skewX = 0, skewY = 0, rotation = 0}) {
    super(...arguments);

    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.skewX = skewX;
    this.skewY = skewY;
  }

  destroy() {
    super.destroy();
    this.x = null;
    this.y = null;
    this.rotation = null;
    this.scaleX = null;
    this.scaleY = null;
    this.skewX = null;
    this.skewY = null;
  }
}
