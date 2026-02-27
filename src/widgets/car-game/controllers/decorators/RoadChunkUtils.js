import {Utils} from "./Utils";
import {ROAD_CHUNK} from "../constants/entities";

export class RoadChunkUtils extends Utils {
  getRoadChunkByIndex(index) {
    const roadChunks = this.getRoadChunks();
    return index >= 0 ? roadChunks[index] : roadChunks[roadChunks.length + index];
  }

  getRoadChunks() {
    return this.getEntitiesByType(ROAD_CHUNK)?.list ?? [];
  }
}
