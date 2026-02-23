import {Component} from "@shared";

export class Input extends Component {
  /**
   * @type {ProcessesEnum}
   */
  static Processes = {
    TAP: "tap",
    KEYBOARD: "keyboard",
    GYROSCOPE: "gyroscope",
  };

  type = "input";

  right = false;

  left = false;

  /**
   * @type {ProcessValue}
   */
  process = Input.Processes.TAP;

  constructor({right, left, process}) {
    super(...arguments);

    this.right = right ?? this.right;
    this.left = left ?? this.left;
    this.process = process ?? this.process;
  }

  destroy() {
    super.destroy();
    this.right = null;
    this.left = null;
    this.process = null;
  }
}

/**
 * @description Возможные типы управления движением объекта
 * @typedef {Object} ProcessesEnum
 * @property {string} TAP
 * @property {string} KEYBOARD
 * @property {string} GYROSCOPE
 * @readonly
 * @enum {string}
 */

/**
 * @typedef {typeof ProcessesEnum} ProcessValue
 * @description Тип управления
 * - TAP — тапами по сторонам экрана
 * - KEYBOARD — кнопками A,D или стрелками Left, Right
 * - GYROSCOPE — наклоном экрана
 */
