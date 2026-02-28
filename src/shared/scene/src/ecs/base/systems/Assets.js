import {System} from "../../core/System";
import {eventSubscription} from "@shared";

export class Assets extends System {
  constructor() {
    super(...arguments);

    this.getAsset = this.getAsset.bind(this);
  }

  init() {
    this.initEvents();
    this.prepareItems();
  }

  prepareItems() {
    const {
      factory,
      storage: {
        mainSceneSettings: {factory: {prepareList = []} = {}},
      },
    } = this;

    factory.prepareItems(prepareList);
  }

  initEvents() {
    const {eventBus} = this;

    eventSubscription({
      target: eventBus,
      callbacksBus: [{event: "get-asset", callback: this.getAsset}],
    });
  }

  getAsset(event) {
    const {
      data: {entity},
    } = event;
    this.addSideEffect({entity, effect: this.getFactoryItem, args: [event], context: this});
  }

  getFactoryItem(event) {
    const {
      data: {name},
      data,
    } = event;
    const {factory} = this;
    const item = factory.getItem(name, data);

    data.result = factory.config[name] ? item.asset : item;

    return () => {
      factory.pushItem(item);
    };
  }
}
