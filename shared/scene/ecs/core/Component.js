import {v4 as uuidv4} from "uuid";

export default class Component {
  /**
   * CHANGE - событие на изменение данных компонента
   * CREATE  - событие на создание компонента
   * REMOVE   - событие на удаление компонента
   * ADD    - событие на добавление компонента в сущность
   * @type {{ADD: string, CREATE: string, REMOVE: string, CHANGE: string}}
   */
  static EVENTS = {
    CHANGE: "component:change",
    REMOVE: "component:remove",
    ADD: "component:add",
    CREATE: "component:create",
  };

  /**
   * Тип компонента для возможности фильтрации компонентов
   * @type {string}
   */
  type = "unknown";

  /**
   * Общий для всех элементов одного движка хаб событий
   * @type  {EventDispatcher}
   */
  eventBus;

  /**
   * Ссылка на сущность, в которой существует компонент
   * @type {null, Entity}
   * @private
   */
  _entity = null;

  constructor({eventBus}) {
    this.eventBus = eventBus;
    this.uuid = uuidv4();
  }

  /**
   * Изменяется сущностью при добавлении\удалении компонента
   * @param entity
   */
  set entity(entity) {
    if (this._entity === entity) return;
    const prevEntity = this._entity;
    this._entity = entity;
    if (entity) this.onAdd();
    else this.onRemove(prevEntity);
  }

  /**
   * Получение сущности, в которой существует компонент
   * @returns {Entity|null}
   */
  get entity() {
    return this._entity;
  }

  /**
   * Функция инициализации компонента
   * @returns {Component}
   */
  init() {
    this.onCreate();
    return this;
  }

  /**
   * Шорткат для диспатча событий
   * @param type {string}- тип события
   * @param data {object}- данные
   */
  dispatch(type, data) {
    this.eventBus.dispatchEvent({type, data});
  }

  /**
   * Коллбек при создании компонента
   */
  onCreate() {
    this.dispatch(Component.EVENTS.CREATE, {component: this});
    this.dispatch(`${Component.EVENTS.CREATE}-${this.type}`, {component: this});
  }

  /**
   * Коллбек при добавлении компонента
   */
  onAdd() {
    this.dispatch(Component.EVENTS.ADD, {component: this});
    this.dispatch(`${Component.EVENTS.ADD}-${this.type}`, {component: this});
  }

  /**
   * Коллбек при удалении компонента
   */
  onRemove() {
    this.dispatch(Component.EVENTS.REMOVE, {component: this});
    this.dispatch(`${Component.EVENTS.REMOVE}-${this.type}`, {component: this});
  }

  /**
   * Коллбек при изменении данных компонента
   */
  onChange() {
    this.dispatch(Component.EVENTS.CHANGE, {component: this});
    this.dispatch(`${Component.EVENTS.CHANGE}-${this.type}`, {component: this});
  }

  destroy() {
    this.entity = null;
    this.eventBus = null;
  }
}
