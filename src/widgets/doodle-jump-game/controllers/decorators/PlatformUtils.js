import {Utils} from "./Utils";
import {PLATFORM} from "../entities/platform";

export class PlatformUtils extends Utils {
  getPlatformByIndex(index) {
    const platforms = this.getEntitiesByType(PLATFORM)?.list ?? [];
    if (index >= 0) return platforms[index];
    else return platforms[platforms.length + index];
  }
}
