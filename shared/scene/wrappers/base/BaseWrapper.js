export default class BaseWrapper {
  constructor(data) {
    for (const key in data)
      this[key] = data[key];
  }

  initController() {

  }
}