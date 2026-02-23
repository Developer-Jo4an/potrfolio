import {Component} from "@shared";

export class Target extends Component {
  type = "child";

  /**
   * @type {TargetValue | null | undefined}
   */
  target;

  entityType;

  constructor({target, entityType}) {
    super(...arguments);

    this.target = target;
    this.entityType = entityType;
  }

  destroy() {
    super.destroy();
    this.target = null;
    this.entityType = null;
  }
}

/**
 * @typedef {{ x: number, y: number } | string} TargetValue
 * @description Таргет для пули - это либо UUID сущности, в которую она летит(стремится),
 * либо нормализованный вектор направления движения
 */
