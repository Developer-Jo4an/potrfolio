import {Component} from "@shared";

export class Physics extends Component {
  type = "physics";

  /**
   * @type {MovementTypesEnum}
   */
  static MovementTypes = {
    linear: "linear",
    accelerated: "accelerated",
  };

  /**
   * @type {MovementTypeValue | null}
   */
  movementType = Physics.MovementTypes.accelerated;

  accelerationY = 9.81; // px/s*60

  accelerationX = 0; // px/s*60

  speedY = 0; // px/s*60

  speedX = 0; // px/s*60

  constructor({movementType, speedX, speedY, accelerationX, accelerationY}) {
    super(...arguments);

    this.movementType = movementType ?? this.movementType;

    this.speedX = speedX ?? this.speedX;
    this.speedY = speedY ?? this.speedY;

    this.accelerationX = accelerationX ?? this.accelerationX;
    this.accelerationY = accelerationY ?? this.accelerationY;
  }

  destroy() {
    super.destroy();

    this.movementType = null;
    this.speedX = null;
    this.speedY = null;
    this.accelerationY = null;
    this.accelerationX = null;
  }
}

/**
 * @typedef {Object} MovementTypesEnum
 * @description Возможные типы движения объекта
 * @property {string} linear
 * @property {string} accelerated
 * @enum {string}
 * @readonly
 */

/**
 * @typedef {typeof MovementTypesEnum} MovementTypeValue
 * @description Тип передвижения объекта
 * Определяет, как обновляется позиция:
 * - linear — движение с постоянной скоростью (линейное)
 * - accelerated — движение с ускорением
 */
