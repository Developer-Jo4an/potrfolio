export class AnimationPlayer {
  constructor() {}

  setDefaultProperties(properties) {
    for (const key in properties) this[key] = properties[key];
  }
}
