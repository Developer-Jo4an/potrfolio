import {Collection} from "../base/components/data/Collection";
import {v4 as uuidv4} from "uuid";
import {State} from "../base/components/state/State";
import {STATE_CHANGED} from "../../constants/events/names";

export class System {
  /**
   * Порядковый номер для сортировки обновления систем
   * @type {number}
   */
  updateOrder = 0;

  /**
   * Общий для всех элементов одного движка хаб событий
   * @type  {EventDispatcher}
   */
  eventBus;

  /**
   * Ссылка на движок системы
   * @type {Engine}
   * @private
   */
  _engine;

  constructor({eventBus, storage}) {
    this.eventBus = eventBus;
    this.storage = storage;
    this.uuid = uuidv4();

    this.eventBus.addEventListener(STATE_CHANGED, this.onStateChanged.bind(this));
  }

  onStateChanged({state}) {
    const game = this.getFirstEntityByType("game");
    if (!game) return;
    const stateComponent = game.get(State);
    stateComponent.state = state;
    this[`${state}Select`]?.();
  }

  /**
   * Инициализация системы
   */
  init() {
  }

  onRemove() {
  }

  /**
   * Добавление очищаемого действия в систему
   * @param entity
   * @param effect
   * @param name
   * @param args
   * @param context
   */
  addSideEffect({entity, effect, name = uuidv4(), args = [], context = this}) {
    const collection = entity.getList(Collection)?.find(({group}) => group === "side-effects");
    if (!collection) return console.error("'side-effects' collection not found");
    const prevEffect = collection.list.find(effect => effect.name === name);
    if (prevEffect) {
      prevEffect.cleanFunction?.();
      collection.list.splice(collection.list.indexOf(prevEffect), 1);
    }

    const cleanFunction = effect.apply(context, args);
    collection.list.push({
      name,
      cleanFunction,
      effect,
      args
    });
  }

  /**
   * Получение списка сущностей по типу
   * @param type
   * @returns {Array<Entity>}
   */
  getEntitiesByType(type) {
    return this._engine.getEntitiesByType(type);
  }

  getFirstEntityByType(type) {
    return this._engine.getEntitiesByType(type)?.list?.[0];
  }

  getEntityByUUID(type, uuid) {
    const collection = this.getEntitiesByType(type);
    return collection?.map?.[uuid];
  }

  getComponentByUUID(Class, uuid) {
    return this._engine.getComponentByUUID(Class, uuid);
  }

  getEntitiesByComponent(component) {
    return this._engine.getEntitiesByComponent(component);
  }

  filterEntitiesByClass(...classes) {
    return this._engine.filterEntities(classes);
  }

  destroyEntitiesByTypes(types) {
    return types.forEach(type => [...this.getEntitiesByType(type)?.list]?.forEach(entity => entity.destroy()));
  }

  /**
   * Получение всех компонентов
   * @returns {T|Collection<Component>}
   */
  get allComponents() {
    return this._engine.allComponents;
  }

  getAllComponentsByClass(ComponentClass) {
    return this.allComponents.filter(component => component instanceof ComponentClass);
  }

  /** Хелпер для добавление компонента в сущность
   *
   * @param entity {Entity}
   * @param ComponentClass {Class<Component>}
   * @param settings {any}- настройки компонента
   * @param condition - условие добавления компонента
   * @returns {Component|null}
   */
  addComponentToEntity(entity, ComponentClass, settings = {}, condition = true) {
    if (!condition) return null;
    const component = new ComponentClass(settings).init();
    entity.add(component);
    return component;
  }

  /** Хелрер для массовое добавление компонентов в сущность
   *
   * @param entity {Entity}
   * @param components {Array<{ComponentClass: Class<Component, settings: any}>} - массив настроек компонентов
   * @param isInit  - инициализация сущности
   * @returns  {Entity}
   */
  addComponentsToEntity(entity, components, isInit = true) {
    components.forEach(({class: ComponentClass, settings, condition = true}) => {
      this.addComponentToEntity(entity, ComponentClass, settings, condition);
    });
    if (isInit) entity.init(); // инициализация сущности

    return entity;
  }

  /**
   * Установка движка при добавлении системы в движок
   * @param engine
   */
  set engine(engine) {
    this._engine = engine;
  }

  get engine() {
    return this._engine;
  }

  /**
   * Ленивое обновление системы
   * @param {{deltaTime: number, totalTime: number}} data
   */
  lazyUpdate(data) {
  }

  /**
   * Обновление системы
   * @param {{deltaTime: number, totalTime: number}} data
   */
  update(data) {
  }

  /**
   * Сброс системы
   */
  reset() {
  }

  /**
   * Функция конфигурирования систем
   * @param settings
   */
  configure(settings) {
  }

  getAsset(entity, name, extraData = {}) {
    const {eventBus} = this;
    const event = {type: "get-asset", data: {name, entity, result: null, ...extraData}};
    eventBus.dispatchEvent(event);
    return event.data.result;
  }
}
