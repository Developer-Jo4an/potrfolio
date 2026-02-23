import {Utils} from "./Utils";
import {lerp} from "@shared";
import {isArray, isFinite, isObject} from "lodash";

export class CombinationUtils extends Utils {
  readProperty(property) {
    if (isFinite(property)) return property;
    else if (isArray(property)) return lerp(property[0], property[1], Math.random());
    else if (isObject(property)) return lerp(property.min, property.max, Math.random());
  }

  getWiredCombination(order) {
    const {
      config: {wiredCombinations},
    } = this.getGameInfo();

    return wiredCombinations.find(({order: ord}) => ord === order);
  }
}
