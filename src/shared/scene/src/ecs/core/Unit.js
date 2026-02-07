import {v4 as uuidv4} from "uuid";
import {Entity} from "./Entity";

export class Unit {
  /**
   * Общий для всех элементов одного движка хаб событий
   * @type  {EventDispatcher}
   */
  eventBus;

  /**
   * Ссылка на движок юнита
   * @type {Engine}
   * @private
   */
  _engine;

  constructor({eventBus, storage}) {
    this.eventBus = eventBus;
    this.storage = storage;
    this.uuid = uuidv4();
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
   * Инициализация юнита
   */
  init() {
  }

  onRemove() {
  }

  /**
   * Получение списка сущностей по типу
   * @param type
   * @returns {Array<Entity>}
   */
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
    return types.forEach((type) => [...this.getEntitiesByType(type)?.list]?.forEach((entity) => entity.destroy()));
  }

  getFirstEntityOrCreate(type) {
    const {eventBus} = this;
    const entity = this.getFirstEntityByType(type);
    return entity ?? new Entity({eventBus, type}).init();
  }

  getComponentsByClasses(...classes) {
    return this.allComponents.filter(component => classes.some(Cls => component instanceof Cls));
  }

  getAllComponentsByClass(ComponentClass) {
    return this.allComponents.filter((component) => component instanceof ComponentClass);
  }

  /**
   * Получение всех компонентов
   * @returns {T|Collection<Component>}
   */
  get allComponents() {
    return this._engine.allComponents;
  }

  /**
   * Сброс юнита
   */
  reset() {
  }

  /**
   * Функция конфигурирования юнита
   * @param settings
   */
  configure(settings) {
  }
}
