import {v4 as uuidv4} from "uuid";
import {Collection} from "../base/components/data/Collection";
import {State} from "../base/components/state/State";
import {Unit} from "./Unit";
import {STATE_CHANGED} from "../../constants/events/names";

export class System extends Unit {
  /**
   * Порядковый номер для сортировки обновления систем
   * @type {number}
   */
  updateOrder = 0;

  /**
   * Фабрика ассетов
   */
  factory;

  constructor({factory}) {
    super(...arguments);

    this.factory = factory;
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
    super.init();
  }

  onRemove() {
    super.onRemove();
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

    if (!collection) {
      console.error("'side-effects' collection not found");
      return;
    }

    const prevEffect = collection.list.find((effect) => effect.name === name);

    if (prevEffect) {
      prevEffect.cleanFunction?.();
      collection.list.splice(collection.list.indexOf(prevEffect), 1);
    }

    const cleanFunction = effect.apply(context, args);
    collection.list.push({name, cleanFunction, effect, args});
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
   * Ленивое обновление системы
   * @param {{deltaTime: number, totalTime: number}} data
   */
  lazyUpdate(data) {}

  /**
   * Обновление системы
   * @param {{deltaTime: number, totalTime: number}} data
   */
  update(data) {}

  /**
   * Сброс системы
   */
  reset() {}

  /**
   * Функция конфигурирования систем
   * @param settings
   */
  configure(settings) {}

  getAsset(entity, name, extraData = {}) {
    const {eventBus} = this;
    const event = {type: "get-asset", data: {name, entity, result: null, ...extraData}};
    eventBus.dispatchEvent(event);
    return event.data.result;
  }
}
