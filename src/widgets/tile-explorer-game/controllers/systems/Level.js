import {Cell, Cell as AssetCell} from "../assets/Cell";
import {Entity, playAnimationOnce, System} from "@shared";
import {TREE} from "../entities/tree";
import {CELL} from "../entities/cell";
import {GAME_SIZE} from "../../constants/game";
import {SHELF} from "../entities/shelf";
import {labels} from "../../constants/labels";

export class Level extends System {
  initializationLevelSelect() {
    this.initTree();
    this.initShelf();
    this.initBounds();
  }

  /**
   * tree
   */
  initTree() {
    const {
      storage: {stage},
      eventBus
    } = this;

    const {entity: eTree, tree, cPixi} = this.getTreeInfo();
    const aTree = (cPixi.pixiObject = this.getAsset(eTree, TREE));
    stage.addChild(aTree);

    const {width, height} = this.calculateCellSize();

    this.runTree(tree, ({cell}) => {
      const eCell = new Entity({eventBus, type: CELL}).init();

      const fullProps = {eCell, cell, width, height};

      this.prepareCellComponent(fullProps);

      if (!cell.type) return;

      this.preparePixiComponent(fullProps);
      this.prepareCellBackground(fullProps);
      this.prepareCellSign(fullProps);
      this.prepareCellExplosion(fullProps);
      this.prepareCellBlocked(fullProps);
      this.prepareCellMatrix(fullProps);
    });

    this.treeToCenter();
  }

  calculateCellSize() {
    const {
      storage: {
        mainSceneSettings: {cell: cellSettings, grid: gridSettings}
      }
    } = this;

    const {tree} = this.getTreeInfo();

    const maxRowLength = tree.reduce((acc, layer) => {
      layer.forEach(({length}) => {
        if (length > acc) acc = length;
      });
      return acc;
    }, 0);

    const width = Math.min(gridSettings.size / maxRowLength, cellSettings.size);
    const height = Math.min(gridSettings.size / maxRowLength, cellSettings.size);

    return {width, height};
  }

  prepareCellComponent({eCell, cell}) {
    const {cCell} = this.getCellInfo(eCell);
    Object.assign(cCell, cell);
  }

  preparePixiComponent({eCell, cell}) {
    const {view} = this.getTreeInfo();
    const {cPixi, isBlocked} = this.getCellInfo(eCell);

    const aCell = (cPixi.pixiObject = this.getAsset(eCell, CELL, {extraData: {type: cell.type}}));
    aCell.zIndex = cell.z;

    const blockedSpineClip = aCell.getChildByLabel(Cell.types.blocked);
    playAnimationOnce({spine: blockedSpineClip, name: "idle_1", pause: true});
    blockedSpineClip.alpha = +isBlocked;

    isBlocked
      ? this.disableCellView(aCell)
      : this.enableCellView(aCell);

    view.addChild(aCell);
  }

  prepareCellBackground({eCell, width, height}) {
    const {view} = this.getCellInfo(eCell);

    const cellBackground = view.getChildByLabel("cellBackground");

    const scaleX = width / cellBackground.width;
    const scaleY = height / cellBackground.height;

    const scaleBackground = Math.min(scaleX, scaleY);

    cellBackground.scale.set(scaleBackground);
  }

  prepareCellSign({eCell, cell, width, height}) {
    const {
      storage: {
        mainSceneSettings: {cell: cellSettings}
      }
    } = this;

    const {view} = this.getCellInfo(eCell);

    const cellSign = view.getChildByLabel(cell.type);

    const scaleSignX = (width * cellSettings.signSizeMultiplier) / cellSign.width;
    const scaleSignY = (height * cellSettings.signSizeMultiplier) / cellSign.height;

    const scaleSign = Math.min(scaleSignX, scaleSignY);

    cellSign.scale.set(scaleSign);
  }

  prepareCellExplosion({eCell, cell, width, height}) {
    const {view} = this.getCellInfo(eCell);

    const cellSignExplosion = view.getChildByLabel(AssetCell.getSpineClipLabel(cell.type, AssetCell.types.explosion));

    const scaleSignExplosionX = width / cellSignExplosion.width;
    const scaleSignExplosionY = height / cellSignExplosion.height;

    const scaleSignExplosion = Math.min(scaleSignExplosionX, scaleSignExplosionY);

    cellSignExplosion.scale.set(scaleSignExplosion);
  }

  prepareCellBlocked({eCell, cell, width, height}) {
    const {view} = this.getCellInfo(eCell);

    const cellSignBlocked = view.getChildByLabel(AssetCell.getSpineClipLabel(cell.type, AssetCell.types.blocked));

    const scaleSignExplosionX = width / cellSignBlocked.width;
    const scaleSignExplosionY = height / cellSignBlocked.height;

    const scaleSignExplosion = Math.min(scaleSignExplosionX, scaleSignExplosionY);

    cellSignBlocked.scale.set(scaleSignExplosion);
  }

  prepareCellMatrix({eCell, cell, width, height}) {
    const {cMatrix3} = this.getCellInfo(eCell);

    const isHasShift = !!(cell.z % 2);

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const shiftX = isHasShift ? halfWidth : 0;
    const shiftY = isHasShift ? halfHeight : 0;

    const x = halfWidth + shiftX + cell.x * width;
    const y = halfWidth + shiftY + cell.y * height;

    cMatrix3.x = x;
    cMatrix3.y = y;
  }

  treeToCenter() {
    const {
      storage: {
        mainSceneSettings: {grid: gridSettings}
      }
    } = this;

    this.forceRender();

    const {
      storage: {stage}
    } = this;
    const {cMatrix3, view} = this.getTreeInfo();

    const boundsTree = view.getBounds();
    const x = (GAME_SIZE.width - boundsTree.width / stage.scale.x) / 2;
    const y = gridSettings.paddingTop / stage.scale.y;

    cMatrix3.x = x;
    cMatrix3.y = y;
  }

  /**
   * shelf
   */
  initShelf() {
    const {
      storage: {
        stage,
        mainSceneSettings: {
          shelf: {position}
        }
      }
    } = this;

    const {entity: eShelf, cMatrix3, cPixi} = this.getShelfInfo();
    const aShelf = (cPixi.pixiObject = this.getAsset(eShelf, SHELF));
    stage.addChild(aShelf);

    const cageSize = this.calculateCageSize();

    const fullProps = {cageSize};

    this.prepareCages(fullProps);
    this.prepareShelfBackground(fullProps);

    cMatrix3.x = position.x;
    cMatrix3.y = position.y;
  }

  calculateCageSize() {
    const {
      storage: {
        mainSceneSettings: {
          shelf: {cage, margin, padding, gap}
        }
      }
    } = this;

    const {max} = this.getShelfInfo();

    return Math.min((GAME_SIZE.width - margin * 2 - (padding * 2 + gap * (max - 1))) / max, cage.size);
  }

  prepareCages({cageSize}) {
    const {
      storage: {
        mainSceneSettings: {
          shelf: {padding, gap}
        }
      }
    } = this;

    const {view} = this.getShelfInfo();

    const cages = view.getChildrenByLabel(labels.shelf.cage);

    cages.forEach((cage, index) => {
      const scaleX = cageSize / cage.width;
      const scaleY = cageSize / cage.height;

      const scale = Math.min(scaleX, cageSize / scaleY);
      cage.scale.set(scale);

      const x = padding + (cage.width + gap) * index;
      const y = padding;
      cage.position.set(x, y);
    });
  }

  prepareShelfBackground({cageSize}) {
    const {
      storage: {
        mainSceneSettings: {
          shelf: {margin, padding}
        }
      }
    } = this;

    const {view} = this.getShelfInfo();

    const background = view.getChildByLabel(labels.shelf.background);

    const width = GAME_SIZE.width - margin * 2;
    const height = cageSize + padding * 2;

    const scaleX = width / background.width;
    const scaleY = height / background.height;

    background.scale.set(scaleX, scaleY);
  }

  /**
   * bounds
   */
  initBounds() {
    this.initTreeBounds();
    this.initShelfBounds();
    this.initQueueBounds();
  }

  initTreeBounds() {
    const {cBounds} = this.getBoundsInfo();
    const treeBounds = (cBounds.bounds.tree = []);

    const {tree} = this.getTreeInfo();

    this.runTree(tree, ({cell: {id}}) => {
      const {x, y, z, type, isBlocked, view} = this.getCellInfoById(id);

      const fullData = {x, y, z, id, type, isBlocked};

      if (!!view)
        Object.assign(fullData, {
          position: {x: view.x, y: view.y},
          width: view.width,
          height: view.height,
          bounds: view.getBounds()
        });

      this.setToTree(treeBounds, x, y, z, fullData);
    });
  }

  initShelfBounds() {
    const {view: treeView} = this.getTreeInfo();

    const {cBounds} = this.getBoundsInfo();
    cBounds.bounds.shelf = [];

    const {view: shelfView} = this.getShelfInfo();
    const cages = shelfView.getChildrenByLabel(labels.shelf.cage);

    this.forceRender();

    cages.forEach(cage => {
      const bounds = cage.getBounds();
      const x = bounds.minX + bounds.width / 2;
      const y = bounds.minY + bounds.height / 2;
      const {x: xFromTree, y: yFromTree} = treeView.toLocal({x, y});

      const leftTopPoint = treeView.toLocal({x: bounds.minX, y: bounds.minY});
      const rightTopPoint = treeView.toLocal({x: bounds.maxX, y: bounds.minY});
      const leftBottomPoint = treeView.toLocal({x: bounds.minX, y: bounds.maxY});

      const width = Math.hypot(rightTopPoint.x - leftTopPoint.x, rightTopPoint.y - leftTopPoint.y);
      const height = Math.hypot(leftBottomPoint.x - leftTopPoint.x, leftBottomPoint.y - leftTopPoint.y);

      cBounds.bounds.shelf.push({x: xFromTree, y: yFromTree, width, height});
    });
  }

  initQueueBounds() {
    const {
      shelf: [queue1, queue2],
      bounds
    } = this.getBoundsInfo();

    bounds.queue = {
      xStart: queue1.x,
      yStart: queue1.y,
      xStep: queue2.x - queue1.x,
      yStep: queue2.y - queue1.y,
      width: queue1.width,
      height: queue1.height
    };
  }

  forceRender() {
    const {eventBus} = this;

    eventBus.dispatchEvent({type: "pixi-render-system:force-update"});
  }
}
