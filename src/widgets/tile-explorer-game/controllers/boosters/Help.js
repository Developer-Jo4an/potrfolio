import {Booster} from "./Booster";
import {events, treeActions} from "../entities/tree";
import {GAME} from "../constants/game";
import {clone} from "lodash";
import {HELP} from "../constants/boosters";

export class Help extends Booster {
  static boosterName = HELP;

  actionData = {};

  async apply() {
    super.apply();

    this.calculateHelpData();
    this.findNecessaryCells();
    await this.animate();
  }

  calculateHelpData() {
    const {
      actionData,
      storage: {
        mainSceneSettings: {
          shelf: {target},
        },
      },
      system,
    } = this;

    const {queue} = system.getShelfInfo();
    const {tree} = system.getTreeInfo();

    let currentType;

    let calculationTypes = {};
    let max = 0;

    queue.forEach(eCell => {
      const {type} = system.getCellInfo(eCell);

      calculationTypes[type] ??= 0;
      calculationTypes[type]++;

      if (calculationTypes[type] > max) {
        currentType = type;
        max = calculationTypes[type];
      }
    });

    if (currentType) {
      actionData.type = currentType;
      actionData.amount = target - max;
      return;
    } else {
      calculationTypes = {};
      max = 0;
    }

    system.runTree(tree, ({cell}) => {
      const isAvailable = !!cell.type && !cell.isResolved && !cell.isInsidePool;

      if (!isAvailable) return;

      const {type} = cell;

      calculationTypes[type] ??= 0;
      calculationTypes[type]++;

      if (calculationTypes[type] === target) {
        currentType = type;
        max = target;
        return true;
      }

      if (calculationTypes[type] > max) {
        currentType = type;
        max = calculationTypes[type];
      }
    });

    actionData.type = currentType;
    actionData.amount = max;
  }

  findNecessaryCells() {
    const {actionData, system} = this;

    const {tree} = system.getTreeInfo();

    const necessaryCells = [];

    system.runTree(tree, ({cell}) => {
      const isAvailable = !!cell.type && !cell.isInsidePool && !cell.isResolved && cell.type === actionData.type;

      if (!isAvailable) return;

      necessaryCells.push(clone(cell));

      if (necessaryCells.length === actionData.amount) return true;
    });

    actionData.necessaryCells = necessaryCells;
  }

  async animate() {
    const {
      eventBus,
      actionData: {necessaryCells},
      system,
    } = this;

    const promises = [];

    necessaryCells.forEach(({id}, i) => {
      const {entity} = system.getCellInfoById(id);

      const tweenPromise = new Promise(res => {
        const tween = gsap
          .to(
            {},
            {
              delay: i * 0.2,
              onComplete() {
                eventBus.dispatchEvent({
                  type: events.update,
                  entity,
                  action: treeActions.addToPool,
                });
                tween.delete(GAME);
                res();
              },
            }
          )
          .save(GAME);
      });

      promises.push(tweenPromise);
    });

    await Promise.allSettled(promises);
  }

  reset() {
    super.reset();
    this.actionData = {};
  }
}
