import {System} from "../../core/System";
import {Entity} from "../../core/Entity";

export class MainGame extends System {
  constructor(data) {
    super(data);

    this.types = data.types;
    this.eventBus.addEventListener(Entity.EVENTS.CREATE, this.onEntityCreated.bind(this));
  }

  init() {
    const {eventBus} = this;
    new Entity({eventBus, type: "game", group: "game"}).init();
  }

  onEntityCreated({data: {entity}}) {
    const {eventBus} = this;
    this.types[entity.type]?.components.forEach(({Class, props}) => entity.add(new Class({eventBus, ...props}).init()));
    this[`${entity.type}Configure`]?.(entity);
  }
}
