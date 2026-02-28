export class BaseDecorator {
  constructor(data) {
    this.updateProperties(data);
  }

  initDecorator() {}

  updateProperties(props) {
    for (const key in props) this[key] = props[key];
  }

  reset() {}
}
