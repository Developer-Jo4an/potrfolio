import {v4 as uuidv4} from "uuid";
import {Entity} from "./Entity";
import {Component} from "./Component";
import {Library as Collection} from "../base/library/Library";
import {analytics} from "../../analytics/Analytics";

export class Engine {
  /**
   * Список созданных систем.
   * @type {Collection}
   */
  systems = new Collection({name: "systems"});

  /**
   * Список созданных декораторов
   * @type {Collection}
   */
  decorators = new Collection({name: "decorators"});

  /**
   * группы сущностей
   * @type {Object<string, Collection>}
   * @property {Array<Entity>} list
   */
  entities = {};

  /**
   * список компонентов
   * @type {{[component-type]: Collection}}
   */
  components = {};

  componentsClasses = new WeakMap();

  _ticks = 0;

  constructor({eventBus, storage, decorators: decoratorClasses = []}) {
    this.eventBus = eventBus;
    this.storage = storage;
    this.uuid = uuidv4();

    analytics.connect("ecs", this);
    this.addListeners();
    this.initDecorators(decoratorClasses);
  }

  /**
   * Инициализация декораторов
   * @param decoratorClasses
   */
  initDecorators(decoratorClasses) {
    const {decorators, storage, eventBus} = this;

    decoratorClasses.forEach((DecoratorCls) => {
      const decorator = new DecoratorCls({eventBus, storage});
      decorator.engine = this;
      decorators.add(decorator);
    });
  }

  /**
   * Добавление системы
   * @param system
   */
  addSystem(system) {
    const {systems, decorators} = this;
    systems.add(system);
    system.engine = this;
    system.init();

    systems.sort((a, b) => a.updateOrder - b.updateOrder);

    decorators.list.forEach((decorator) => {
      decorator.rollDescriptors(system);
    });

    return this;
  }

  /**
   * Получение сущностей сопределенным типом
   * @param type {string}
   * @returns {*}
   */
  getEntitiesByType(type) {
    return this.entities[type];
  }

  /**
   * Получение сущностей с определенным компонентом
   * @param component {string}
   * @returns {*}
   */
  getEntitiesByComponent(component) {
    return Object.values(this.entities).flatMap(({list}) => list.filter((entity) => entity.has(component)));
  }

  /**
   * Получение всех компонентов
   * @returns {T}
   */
  get allComponents() {
    return Object.values(this.components).reduce((result, {list}) => [...result, ...list], []);
  }

  /**
   * Удаление системы
   * @param system
   */
  removeSystem(system) {
    const {systems} = this;
    systems.remove(system);
    system.onRemove();
    system.engine = null;
  }

  /**
   * Добавление слушателей на действия с компонентами и сущностями
   */
  addListeners() {
    this.addEntityListeners();
    this.addComponentListeners();
  }

  /**
   * Добавление слушателей на действия с компонентами
   */
  addComponentListeners() {
    const {eventBus} = this;
    eventBus.addEventListener(Component.EVENTS.ADD, this.onComponentAdded.bind(this));
    eventBus.addEventListener(Component.EVENTS.REMOVE, this.onComponentRemoved.bind(this));
    eventBus.addEventListener(Component.EVENTS.CREATE, this.onComponentCreated.bind(this));
  }

  /**
   * Коллбек на добавление компонента
   * @param component
   * @param type
   */
  onComponentAdded({
    data: {
      component,
      component: {type},
    },
  }) {
    this.checkComponentCollection(type, component.constructor);
  }

  /**
   * Коллбек на удаление компонента
   * @param component
   * @param type
   */
  onComponentRemoved({
    data: {
      component,
      component: {type},
    },
  }) {
    this.checkComponentCollection(type, component.constructor);

    this.components[type].remove(component);

    const collection = this.componentsClasses.get(component.constructor);
    collection.remove(component);
  }

  getComponentByUUID(Class, uuid) {
    return this.componentsClasses.get(Class)?.map?.[uuid];
  }

  /**
   * Коллбек на создание компонента
   * @param component
   * @param type
   */
  onComponentCreated({
    data: {
      component,
      component: {type},
    },
  }) {
    this.checkComponentCollection(type, component.constructor);

    this.components[type].add(component);

    const collection = this.componentsClasses.get(component.constructor);
    collection.add(component);
  }

  /**
   * Проверка существования коллекции компонентов определенного типа
   * @param type
   * @param Component
   */
  checkComponentCollection(type, Component) {
    if (!this.components[type]) this.components[type] = new Collection({name: type});

    if (!this.componentsClasses.has(Component)) {
      this.componentsClasses.set(Component, new Collection({name: type}));
    }
  }

  /**
   * Добавление слушателей на действия с сущностями
   */
  addEntityListeners() {
    const {eventBus} = this;
    eventBus.addEventListener(Entity.EVENTS.REMOVE, this.onEntityRemoved.bind(this));
    eventBus.addEventListener(Entity.EVENTS.CREATE, this.onEntityCreated.bind(this));
  }

  /**
   * Коллбек на удаление сущности
   * @param entity
   * @param type
   */
  onEntityRemoved({
    data: {
      entity,
      entity: {type},
    },
  }) {
    this.checkEntityCollection(type);
    this.entities[type].remove(entity);
  }

  /**
   * Коллбек на создание сущности
   * @param entity
   * @param type
   */
  onEntityCreated({
    data: {
      entity,
      entity: {type},
    },
  }) {
    this.checkEntityCollection(type);
    this.entities[type].add(entity);
  }

  /**
   * Проверка существования коллекции сущностей определенного типа
   * @param type
   */
  checkEntityCollection(type) {
    if (!this.entities[type]) this.entities[type] = new Collection({name: type});
  }

  /**
   * Обновление систем
   * @param data
   */
  update(data) {
    this._ticks++;
    this.systems.list.forEach((system) => system.update({...data, ticks: this._ticks}));
  }

  /**
   * Обновление систем
   * @param data
   */
  lazyUpdate(data) {
    this._ticks++;
    this.systems.list.forEach((system) => system.lazyUpdate({...data, ticks: this._ticks}));
  }

  /**
   * Сброс систем
   */
  reset() {
    this.systems.list.forEach((system) => system.reset());
  }

  /**
   * Функция конфигурирования систем
   * @param settings
   */
  configure(settings) {
    this.systems.list.forEach((system) => system.configure(settings));
  }

  /**
   * @param {Array<function(new:Component, ...*)>}components
   * @returns {Array<Entity>}
   */
  filterEntities(components) {
    const first = components[0];
    if (!this.componentsClasses.has(first)) return [];
    return this.componentsClasses
      .get(first)
      .list.filter((component) => component.entity.isInherits(components))
      .map((component) => component.entity);
  }

  destroy() {
    while (this.systems.list.length > 0) {
      this.removeSystem(this.systems.list[0]);
    }
    Object.values(this.entities).forEach(({list}) => {
      while (list.length > 0) {
        list[0].destroy();
      }
    });
    this.entities = {};
  }
}
