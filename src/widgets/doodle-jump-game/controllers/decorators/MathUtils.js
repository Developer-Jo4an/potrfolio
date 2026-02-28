import {Utils} from "./Utils";

export class MathUtils extends Utils {
  getPositionFromStage(pixiObject, point, skipUpdate = true) {
    const {
      storage: {stage},
    } = this;

    return stage.toLocal(point, pixiObject.parent, null, skipUpdate);
  }

  calculateJumpForce() {
    const {
      settings: {jumpForce},
      cBooster: {data: boosterData},
      cHelper: {data: helperData},
    } = this.getCharacterInfo();

    return [boosterData?.jumpForceMultiplier, helperData?.jumpForceMultiplier].reduce(
      (acc, multiplier) => acc * (multiplier ?? 1),
      jumpForce,
    );
  }

  calculateJumpTime() {
    const {
      storage: {
        mainSceneSettings: {timeScale},
      },
    } = this;

    const {
      cPhysics: {accelerationY},
    } = this.getCharacterInfo();

    const jumpForce = this.calculateJumpForce();

    /**
     * Время, за которое персонаж дойдет до высшей точки
     * @description
     * Формула из раздела физики: характеристики полета: t = Vo * sin(A) / g
     * Тут мы как будто кидаем персонажа под 90 градусов, так же
     * тут есть деление на timeScale, т.к игра по умолчанию замедлена
     */

    return Math.abs((jumpForce * Math.sin(Math.PI / 2)) / accelerationY) / timeScale;
  }
}
