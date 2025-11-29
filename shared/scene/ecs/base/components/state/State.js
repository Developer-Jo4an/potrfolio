import Component from "../../../core/Component";

export default class State extends Component {
  type = "state";

  states = null;

  _state = null;

  constructor(data) {
    super(data);

    this.states = data.states;
    this.state = data.state;
  }

  set state(state) {
    if (this._state === state) return;

    const isStateAvailable = !this.state || this.states[this.state].availableStates.includes(state);
    if (!isStateAvailable) return;

    this._state = state;
  }

  get state() {
    return this._state;
  }
}
