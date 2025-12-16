import Component from "../../core/Component";

export default class Mixer extends Component {
  mixer;

  animations = {};

  type = "mixer";

  constructor(data) {
    super(data);

    this.mixer = data.mixer;
  }
}
