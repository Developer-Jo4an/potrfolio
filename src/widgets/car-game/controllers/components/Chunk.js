import {Component} from "@shared";

export class Chunk extends Component {
  points = {};

  width = {};

  adjacentLeg = 0;

  oppositeLeg = 0;

  direction = null;

  constructor({points = {}, width = {}, adjacentLeg = 0, oppositeLeg = 0, direction = null}) {
    super(...arguments);

    this.points = points;
    this.width = width;
    this.adjacentLeg = adjacentLeg;
    this.oppositeLeg = oppositeLeg;
    this.direction = direction;
  }

  destroy() {
    super.destroy();
    this.points = null;
    this.width = null;
    this.adjacentLeg = null;
    this.oppositeLeg = null;
    this.direction = null;
  }
}
