import {Booster as CBooster} from "../components/Booster";
import {Mix} from "../boosters/Mix";
import {Back} from "../boosters/Back";
import {Help} from "../boosters/Help";
import {System} from "@shared";
import {BOOSTER, events} from "../entities/booster";

export class Boosters extends System {
  uuid = "boosters";

  init() {
    const {eventBus, storage} = this;

    const props = {eventBus, storage, system: this};

    this.boostersMap = {
      [Mix.boosterName]: new Mix(props),
      [Back.boosterName]: new Back(props),
      [Help.boosterName]: new Help(props),
    };
  }

  isCanUse(type) {
    const {boostersMap} = this;

    const eBooster = this.getFirstEntityOrCreate(BOOSTER);
    const cBooster = eBooster.get(CBooster);
    if (cBooster.isActive) return false;

    const booster = boostersMap[type];
    return booster.isAvailable;
  }

  async applyBooster(type) {
    const {eventBus, boostersMap} = this;

    if (!this.isCanUse(type)) return;

    const booster = boostersMap[type];
    if (!booster) return;

    await this.waitAllPromises();

    const boosterData = await booster.apply();
    eventBus.dispatchEvent({type: events.applied, boosterData});

    await this.waitAllPromises();

    booster.reset();
  }

  reset() {
    const {boostersMap} = this;

    for (const key in boostersMap) {
      const booster = boostersMap[key];
      booster.reset();
    }
  }
}
