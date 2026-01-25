import {PixiComponent, System, Entity} from "@shared";
import {AbstractTree} from "../components/AbstractTree";
import {Cell} from "../components/Cell";
import {ABSTRACT_TREE} from "../entities/AbstractTree";
import {CELL} from "../entities/Cell";
import {CELL_BACKGROUND} from "../../constants/preload";
import {GAME_SIZE} from "../../constants/game";

export class Level extends System {
  initializationLevelSelect() {
    this.initGrid();
  }

  initGrid() {
    const {
      storage: {
        stage,
        mainSceneSettings: {cell: cellSettings, grid: gridSettings},
      },
      eventBus,
    } = this;

    const eAbstractTree = this.getFirstEntityByType(ABSTRACT_TREE);

    const cPixiComponent = eAbstractTree.get(PixiComponent);
    const aAbstractTree = (cPixiComponent.pixiObject = this.getAsset(eAbstractTree, ABSTRACT_TREE));
    stage.addChild(aAbstractTree);

    const cAbstractTree = eAbstractTree.get(AbstractTree);
    const maxRowLength = cAbstractTree.tree.reduce((acc, layer) => {
      layer.forEach(({length}) => {
        if (length > acc) acc = length;
      });
      return acc;
    }, 0);
    const width = Math.min(gridSettings.size / maxRowLength, cellSettings.size);
    const height = Math.min(gridSettings.size / maxRowLength, cellSettings.size);

    cAbstractTree.tree.forEach((layer) => {
      layer.forEach((row) => {
        row.forEach((cell) => {
          const eCell = new Entity({eventBus, type: CELL}).init();

          const cCell = eCell.get(Cell);
          cCell.x = cell.x;
          cCell.y = cell.y;
          cCell.z = cell.z;

          if (!cell.type) return;

          const cPixi = eCell.get(PixiComponent);
          const asset = (cPixi.pixiObject = this.getAsset(eCell, CELL, {type: cell.type}));
          aAbstractTree.addChild(asset);

          const cellBackground = asset.getChildByLabel(CELL_BACKGROUND);
          const scaleBackground = Math.min(width / cellBackground.width, height / cellBackground.height);
          cellBackground.scale.set(scaleBackground);

          const cellSign = asset.getChildByLabel(cell.type);
          const scaleSign = Math.min(
            (width * cellSettings.signSizeMultiplier) / cellSign.width,
            (height * cellSettings.signSizeMultiplier) / cellSign.height,
          );
          cellSign.scale.set(scaleSign);

          const halfWidth = asset.width / 2;
          const halfHeight = asset.height / 2;
          const shiftX = cell.z * halfWidth;
          const shiftY = cell.z * halfHeight;
          const x = halfWidth + shiftX + cell.x * asset.width;
          const y = halfHeight + shiftY + cell.y * asset.height;
          asset.position.set(x, y);
        });
      });
    });

    const boundsTree = aAbstractTree.getBounds();
    const paddingX = (GAME_SIZE.width - boundsTree.width / stage.scale.x) / 2;
    const paddingY = gridSettings.paddingTop;
    aAbstractTree.position.set(paddingX, paddingY);
  }

  update() {}
}
