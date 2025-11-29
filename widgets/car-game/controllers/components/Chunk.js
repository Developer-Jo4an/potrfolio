import Component from "../../../../shared/scene/ecs/core/Component";

export default class Chunk extends Component {
  type = "chunk";

  points = {};

  width = {};

  adjacentLeg = 0;

  oppositeLeg = 0;

  direction = null;

  constructor({eventBus, points = {}, width = {}, adjacentLeg = 0, oppositeLeg = 0, direction = null}) {
    super({eventBus});

    this.points = points;
    this.width = width;
    this.adjacentLeg = adjacentLeg;
    this.oppositeLeg = oppositeLeg;
    this.direction = direction;
  }

  destroy() {
    this.points = {};
    this.width = {};
    this.adjacentLeg = 0;
    this.oppositeLeg = 0;
    this.direction = null;
    super.destroy();
  }
}
