import {CellToCage} from "../tweens/tweens/CellToCage";
import {HideCell} from "../tweens/tweens/HideCell";
import {ChangeBlocked} from "../tweens/tweens/ChangeBlocked";
import {Enter} from "../tweens/tweens/Enter";
import {ReturnCell} from "../tweens/tweens/ReturnCell";
import {Cell} from "../assets/Cell";
import {random, upperFirst} from "lodash";
import {treeActions, events} from "../entities/tree";
import {tweens} from "../constants/tweens";
import {CELL} from "../entities/cell";
import {ANIMATION_TREE} from "../entities/animationTree";
import {System, Entity, eventSubscription, playAnimationOnce} from "@shared";

export class Animations extends System {
  constructor() {
    super(...arguments);

    this.onUpdate = this.onUpdate.bind(this);
    this.onUpdated = this.onUpdated.bind(this);
  }

  initializationLevelSelect() {
    this.initAnimationTree();
    this.applyIdleAnimations();
    this.initEvents();
  }

  initAnimationTree() {
    const {eventBus} = this;
    new Entity({type: ANIMATION_TREE, eventBus}).init();
  }

  applyIdleAnimations() {
    const {
      storage: {
        mainSceneSettings: {
          cell: {
            animations: {
              idle: {s, m, l},
            },
          },
        },
      },
    } = this;

    const cells = this.getEntitiesByType(CELL).list;
    const {entity: eAnimationTree} = this.getAnimationTreeInfo();

    const playIdle = (spine) => playAnimationOnce({spine, name: "idle"});

    this.addSideEffect({
      entity: eAnimationTree,
      effect() {
        const clears = cells.reduce((acc, eCell) => {
          const {type, view} = this.getCellInfo(eCell);

          if (!view) return acc;

          const spineClip = view.getChildByLabel(type);

          playIdle(spineClip);
          spineClip.state.timeScale = 0;

          const timeoutId = setTimeout(
            () => {
              spineClip.state.timeScale = 1;
              playIdle(spineClip);
            },
            random(s, m),
          );

          const intervalId = setInterval(
            () => {
              playIdle(spineClip);
            },
            random(m, l),
          );

          acc.push(
            () => clearTimeout(timeoutId),
            () => clearInterval(intervalId),
          );

          return acc;
        }, []);

        return () => clears.forEach((clear) => clear());
      },
    });
  }

  initEvents() {
    const {
      eventBus,
      storage: {
        serviceData: {clearFunctions},
      },
    } = this;

    const clear = eventSubscription({
      target: eventBus,
      callbacksBus: [
        {event: events.update, callback: this.onUpdate},
        {event: events.updated, callback: this.onUpdated},
      ],
    });

    clearFunctions.push(clear);
  }

  onUpdate({action}) {
    const method = createMethod(action);
    this[method]?.(...arguments);
  }

  onUpdated() {
    this.applyShowAnimations();
  }

  [createMethod(treeActions.addToPool)]({entity}) {
    const {queue} = this.getAnimationTreeInfo();

    const newQueue = this.calculateNewQueue(queue, entity);

    const fullProps = {queue: newQueue, entity};

    this.changeAnimationTree(fullProps);
    this.checkOnFilterCells(fullProps);
    this.applyEnterAnimation(fullProps);
  }

  [createMethod(treeActions.removeFromPool)]({cell}) {
    const {queue} = this.getAnimationTreeInfo();

    const {cMatrix3, cPromise, cTween, view} = this.getCellInfoById(cell.id);
    const {tree: treeBounds} = this.getBoundsInfo();
    const {
      position: {x, y},
      width,
      height,
    } = this.getFromTree(treeBounds, cell.x, cell.y, cell.z);

    const scaleX = cMatrix3.scaleX * (width / view.width);
    const scaleY = cMatrix3.scaleY * (height / view.height);

    const returnTween = new ReturnCell({
      vars: {
        animateObject: cMatrix3,
        x,
        y,
        scaleX,
        scaleY,
        onComplete() {
          cTween.remove(tweens.returnCell);
        },
      },
    });

    cTween.add(returnTween, tweens.returnCell);
    cPromise.add(returnTween.promise);

    const newQueue = [...queue];
    newQueue.pop();
    this.changeAnimationTree({queue: newQueue}, false);
  }

  changeAnimationTree({queue}, force = true) {
    const {cQueue} = this.getAnimationTreeInfo();
    cQueue.queue = queue;

    force && this.applyMoveAnimations();
  }

  checkOnFilterCells() {
    const {
      storage: {
        mainSceneSettings: {
          shelf: {target},
        },
      },
    } = this;

    const {queue} = this.getAnimationTreeInfo();

    const reduceTypes = this.reduceShelfTypes(queue);

    for (const key in reduceTypes) {
      const cellArr = reduceTypes[key];
      if (cellArr.length >= target) {
        const chunks = this.getChunksByTarget(cellArr);
        this.applyHideAnimations(chunks);
      }
    }
  }

  applyMoveAnimations() {
    const {
      storage: {
        mainSceneSettings: {
          cell: {animationThreshold},
        },
      },
    } = this;

    const {queue} = this.getAnimationTreeInfo();

    queue.forEach((eCell, index) => {
      const {cMatrix3, cPromise, cTween} = this.getCellInfo(eCell);
      const prevMoveTween = cTween.get(tweens.cellToCage);

      const {x, y} = this.getTweenTarget(index);

      const distanceBetween = Math.hypot(x - cMatrix3.x, y - cMatrix3.y);

      if (distanceBetween <= animationThreshold) return;

      if (prevMoveTween) {
        prevMoveTween.updateTarget({x, y});
        return;
      }

      const moveTween = new CellToCage({
        vars: {
          animateObject: cMatrix3,
          x,
          y,
          onComplete() {
            cTween.remove(tweens.cellToCage);
          },
        },
      });
      cPromise.add(moveTween.promise);
      cTween.add(moveTween, tweens.cellToCage);
    });
  }

  applyHideAnimations(chunks) {
    const {
      storage: {
        mainSceneSettings: {
          shelf: {target},
        },
      },
    } = this;

    chunks.forEach(async (chunk) => {
      if (chunk.length !== target) return;

      const isHasHideTween = chunk.some((eCell) => {
        const {cTween} = this.getCellInfo(eCell);
        return cTween.has(tweens.hideCell);
      });

      if (isHasHideTween) return;

      const moveTweens = chunk.reduce((acc, eCell) => {
        const {cTween} = this.getCellInfo(eCell);
        const cellToCageTween = cTween.get(tweens.cellToCage);
        if (cellToCageTween) acc.push(cellToCageTween);
        return acc;
      }, []);

      const hideTweens = chunk.map((eCell) => {
        const {type, view, cTween, cMatrix3, cPromise} = this.getCellInfo(eCell);
        const clip = view.getChildByLabel(Cell.getSpineClipLabel(type, Cell.types.explosion));

        const enterTween = cTween.get(tweens.enter);
        if (enterTween) {
          enterTween.tween.progress(1);
          enterTween.destroy();
        }

        const tween = new HideCell({
          vars: {
            animateObject: cMatrix3,
            view,
            clip,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            onComplete() {
              cTween.remove(tweens.hideCell);
            },
          },
        });

        cPromise.add(tween.promise);
        cTween.add(tween, tweens.hideCell);

        return tween;
      });

      const movePromises = moveTweens.map(({promise}) => promise);
      const hidePromises = hideTweens.map(({promise}) => promise);

      await Promise.allSettled(movePromises);

      hideTweens.forEach((hideTween) => hideTween.resume());

      await Promise.allSettled(hidePromises);

      const {queue} = this.getAnimationTreeInfo();
      const newQueue = [...queue];

      const indexes = chunk.map((eCell) => newQueue.indexOf(eCell));
      newQueue.splice(indexes[0], indexes.length);

      this.changeAnimationTree({queue: newQueue});
    });
  }

  applyShowAnimations() {
    const {tree, prevTrees} = this.getTreeInfo();
    const lastTree = prevTrees[prevTrees.length - 1];

    this.runTree(tree, ({cell: {id}}) => {
      const {x, y, z, cTween, cPromise, isBlocked, view} = this.getCellInfoById(id);
      const prevCellState = this.getFromTree(lastTree, x, y, z);

      const isReturn = !view || prevCellState.isBlocked === isBlocked;

      if (isReturn) return;

      const prevTween = cTween.get(tweens.changeBlocked);
      prevTween && prevTween.destroy();

      const changeBlockedTween = new ChangeBlocked({
        vars: {
          animateObject: view.getChildByLabel(Cell.types.blocked),
          isBlocked,
          onComplete() {
            cTween.remove(tweens.changeBlocked);
          },
        },
      });

      cTween.add(changeBlockedTween, tweens.changeBlocked);
      cPromise.add(changeBlockedTween.promise);
    });
  }

  applyEnterAnimation({entity: eCell}) {
    const {cTween, view, cMatrix3, cPromise} = this.getCellInfo(eCell);
    const {
      queue: {width, height},
    } = this.getBoundsInfo();

    const scaleX = cMatrix3.scaleX * (width / view.width);
    const scaleY = cMatrix3.scaleY * (height / view.height);

    const enterTween = new Enter({
      vars: {
        animateObject: cMatrix3,
        scaleX,
        scaleY,
        onComplete() {
          cTween.remove(tweens.enter);
        },
      },
    });
    cTween.add(enterTween, tweens.enter);
    cPromise.add(enterTween.promise);
  }

  getTweenTarget(index) {
    const {
      queue: {xStart, yStart, xStep, yStep, width, height},
    } = this.getBoundsInfo();

    const x = xStart + index * xStep;
    const y = yStart + index * yStep;

    return {x, y, width, height};
  }
}

function createMethod(action) {
  return `on${upperFirst(action)}`;
}
