import {v4 as uuidv4} from "uuid";

export class Entity {
  /**
   * CHANGE    - событие для изменения сущности
   * REMOVE    - событие для удаления сущности
   * ENABLE    - событие для включения сущности
   * DISABLE   - событие для отключения сущности
   * CREATE    - событие для создания сущности
   * @type {{DISABLE: string, CREATE: string, REMOVE: string, CHANGE: string, ENABLE: string}}
   */
  static EVENTS = {
    CHANGE: "entity:change",
    REMOVE: "entity:remove",
    CREATE: "entity:create",
    ENABLE: "entity:enable",
    DISABLE: "entity:disable"
  };

  /**
   * Тип сущности для возможности последующей фильтрации
   * @type {string}
   */
  type = "unknown";

  /**
   * Группа сущности для дополнительной фильтрации
   * @type {string}
   */
  group = "unknown";

  /**
   * Имя сущности для дополнительной фильтрации
   * @type {string}
   */
  name = "empty";

  /**
   * Список компонентов сущности
   * @typedef {import("./Component").default} ECSComponent
   * @type {Array<ECSComponent>}
   */
  children = [];

  /**
   * Общий для всех элементов одного движка хаб событий
   * @type {EventDispatcher}
   */
  eventBus;

  constructor({eventBus, type, group, name}) {
    this.eventBus = eventBus;
    this.type = type ?? this.type;
    this.group = group ?? this.group;
    this.name = name ?? this.name;
    this.uuid = uuidv4();
  }

  /**
   * Шорткат создание сущности
   * @param type
   * @param data
   */
  dispatch(type, data) {
    this.eventBus.dispatchEvent({type, data});
  }

  /**
   * Инициализация сущности
   */
  init(data) {
    this.onCreate(data);
    return this;
  }

  /**
   * Добавление компонента(ов) в сущность
   * @param newChildren
   */
  add(...newChildren) {
    const {children} = this;
    children.push(...newChildren);
    newChildren.forEach(child => child.entity = this);
  }

  /**
   * Удаление компонента из сущности
   * @param child
   */
  remove(child) {
    const {children} = this;
    const index = children.indexOf(child);
    if (index !== -1) {
      const [component] = children.splice(index, 1);
      component.destroy();
    }
  }

  /**
   * Удаление всех компонентов сущности
   */
  removeAll() {
    const {children} = this;
    children.forEach(child => child.destroy());
    children.length = 0;
  }

  /**
   * Удаление всех компонентов, созданных от одно класса(по классу)
   */
  removeSome(Class) {
    const {children} = this;

    const indexes = [];
    for (let i = children.length - 1; i >= 0; i--)
      children[i] instanceof Class && indexes.push(i);

    for (const index of indexes) {
      const [component] = children.splice(index, 1);
      component.destroy();
    }
  }

  /**
   * Полная очистка сущности
   */
  destroy() {
    this.removeAll();
    this.onRemove();
    this.type = "unknown";
    this.group = "unknown";
    this.name = "empty";
  }

  /**
   * Коллбек на создание сущности
   */
  onCreate(data) {
    this.dispatch(Entity.EVENTS.CREATE, {entity: this, ...data});
    this.dispatch(`${Entity.EVENTS.CREATE}-${this.type}`, {entity: this, ...data});
  }

  /**
   *  Коллбек на удаление сущности
   */
  onRemove() {
    this.dispatch(Entity.EVENTS.REMOVE, {entity: this});
    this.dispatch(`${Entity.EVENTS.REMOVE}-${this.type}`, {entity: this});
  }

  /**
   *  Деакализация сущности
   */
  disable() {
    this.dispatch(Entity.EVENTS.DISABLE, {entity: this});
    this.dispatch(`${Entity.EVENTS.DISABLE}-${this.type}`, {entity: this});
  }

  /**
   * Активация сущности
   */
  enable() {
    this.dispatch(Entity.EVENTS.ENABLE, {entity: this});
    this.dispatch(`${Entity.EVENTS.ENABLE}-${this.type}`, {entity: this});
  }


  isInherits(components) {
    return components.every(component => this.has(component));
  }

  has(Class) {
    const {children} = this;
    return children.some(v => v instanceof Class);
  }

  /**
   * @template T
   * @param {function(new:T)} ComponentClass
   * @returns {T}
   */
  get(ComponentClass) {
    const {children} = this;
    return children.find(v => v instanceof ComponentClass);
  }

  /**
   * @template T
   * @param {function(new:T)} ComponentClass
   * @returns {Array<T>}
   */
  getList(ComponentClass) {
    const {children} = this;
    return children.filter(v => v instanceof ComponentClass);
  }

  /**
   * @template T
   * @param {function(new:T)} ComponentClass
   * @param {string} types
   * @returns {Array<T>}
   */
  getSome(ComponentClass, ...types) {
    const {children} = this;
    return children.filter(component => component instanceof ComponentClass && types.includes(component.type));
  }
}
