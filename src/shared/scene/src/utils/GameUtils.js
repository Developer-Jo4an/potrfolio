export class GameUtils {
  constructor() {}

  setDefaultProperties(properties) {
    for (const key in properties) this[key] = properties[key];
  }
}
