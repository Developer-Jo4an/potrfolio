import {System} from "../../core/System";

export class Assets extends System {
  constructor(data) {
    super(data);
    this.factory = data.factory;
    this.eventBus.addEventListener("get-asset", this.getAsset.bind(this));
  }

  init() {
    const {
      factory,
      storage: {
        mainSceneSettings: {factory: {prepareList = []} = {}}
      }
    } = this;

    prepareList.forEach(({type, count}) => factory.prepareItems(type, count));
  }

  getAsset(event) {
    const {
      data: {entity}
    } = event;
    this.addSideEffect({entity, effect: this.getFactoryItem, args: [event], context: this});
  }

  getFactoryItem(event) {
    const {
      data: {name},
      data
    } = event;
    const {factory} = this;

    const item = factory.getItem(name, data);

    data.result = factory.config[name] ? item.asset : item;

    return () => {
      factory.pushItem(item);
    };
  }
}
