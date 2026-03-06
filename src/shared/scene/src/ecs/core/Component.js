export class Component {
  /**
   * CREATE - событие на создание компонента
   * REMOVE - событие на удаление компонента
   * ADD - событие на добавление компонента в сущность
   * @type {{ADD: string, CREATE: string, REMOVE: string}}
   */
  static EVENTS = {REMOVE: "component:remove", ADD: "component:add", CREATE: "component:create"};

  /**
   * Тип компонента для возможности фильтрации компонентов
   * @type {string}
   */
  type = "unknown";

  /**
   * Группа компонента для дополнительной фильтрации
   * @type {string}
   */
  group = "unknown";

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

  /**
   * Прочие утилитарные данные
   * @type {null, object}
   */
  serviceData = {};

  constructor({eventBus, type, group}) {
    this.type = type ?? this.type;
    this.group = group ?? this.group;
    this.eventBus = eventBus;
    this.uuid = crypto.randomUUID();
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

  destroy() {
    this.entity = null;
    this.eventBus = null;
    this.serviceData = null;
    this.type = null;
    this.group = null;
  }
}
