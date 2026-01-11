import Component from "../../../core/Component";

export default class State extends Component {

  type = "state";

  states = null;

  _state = null;

  constructor({states, state}) {
    super(...arguments);

    this.states = states;
    this.state = state;
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

  destroy() {
    super.destroy();
    this.states = null;
    this._state = null;
  }
}
