import {v4 as uuidv4} from "uuid";

const DEFAULT_TYPE = "unknown";
const DEFAULT_GROUP = "unknown";
const DEFAULT_NAME = "empty";

export default class Entity {
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
  type = DEFAULT_TYPE;

  /**
   * Группы сущности для дополнительной фильтрации
   * @type {string}
   */
  group = DEFAULT_GROUP;

  /**
   * Имя сущности для дополнительной фильтрации
   * @type {string}
   */
  name = DEFAULT_NAME;

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

  constructor({eventBus, type, group = type, name = group}) {
    this.eventBus = eventBus;
    this.type = type ?? this.type;
    this.group = group ?? this.group;
    this.name = name ?? this.name;
    this.uuid = uuidv4();
  }

  /**
   * Получение компонента по типу
   * @param type {string}
   * @returns {ECSComponent}
   */
  getComponentByType(type) {
    const {children} = this;
    return children.find(({type: cType}) => cType === type);
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
   * Добавледение компонента(ов) в сущность
   * @param newChildren
   */
  add(...newChildren) {
    const {children} = this;
    children.push(...newChildren);
    newChildren.forEach(child => child.entity = this);
    this.onChange();
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
      this.onChange();
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
   * Удаление всех компонентов, созданных от одно класса(по типу)
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
   *  Коллбек на изменение сущности
   */
  onChange() {
    this.dispatch(Entity.EVENTS.CHANGE, {entity: this});
    this.dispatch(`${Entity.EVENTS.CHANGE}-${this.type}`, {entity: this});
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
    return this.children.some(v => v instanceof Class);
  }

  /**
   * @template T
   * @param {function(new:T)} ComponentClass
   * @returns {T}
   */
  get(ComponentClass) {
    return this.children.find(v => v instanceof ComponentClass);
  }

  /**
   * @template T
   * @param {function(new:T)} ComponentClass
   * @returns {Array<T>}
   */
  getList(ComponentClass) {
    return this.children.filter(v => v instanceof ComponentClass);
  }
}
