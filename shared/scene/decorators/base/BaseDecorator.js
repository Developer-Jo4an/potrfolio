export default class BaseDecorator {
  constructor(data) {
    for (const key in data)
      this[key] = data[key];
  }

  initDecorator() {

  }
}