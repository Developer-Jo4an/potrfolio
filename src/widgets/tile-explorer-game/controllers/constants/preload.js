import {SCENE, TEXTURE, assets} from "@shared";

export const SNOW = "snow";
export const TILE_EXPLORER = "tileExplorer";
export const CELL_BACKGROUND = "cellBackground";
export const CAGE = "cage";
export const SHELF = "shelf";
export const SNOWS_CONTAINER = "snows";

export const preload = [
  {
    type: TEXTURE,
    name: SNOW,
    src: assets("tile-explorer/snow.png"),
  },
  {
    type: TEXTURE,
    name: CELL_BACKGROUND,
    src: assets("tile-explorer/cell-background.png"),
  },
  {
    type: TEXTURE,
    name: CAGE,
    src: assets("tile-explorer/cage.png"),
  },
  {
    type: TEXTURE,
    name: SHELF,
    src: assets("tile-explorer/shelf.png"),
  },
  {
    type: SCENE,
    name: TILE_EXPLORER,
    src: {
      atlas: assets("tile-explorer/spine/tele.atlas"),
      skeletons: {
        "skeleton_Item_1_0": assets("tile-explorer/spine/Item_1_0.json"),
        "skeleton_Item_1_0_explosion": assets("tile-explorer/spine/Item_1_0_explosion.json"),

        "skeleton_Item_1_1": assets("tile-explorer/spine/Item_1_1.json"),
        "skeleton_Item_1_1_explosion": assets("tile-explorer/spine/Item_1_1_explosion.json"),

        "skeleton_Item_1_2": assets("tile-explorer/spine/Item_1_2.json"),
        "skeleton_Item_1_2_explosion": assets("tile-explorer/spine/Item_1_2_explosion.json"),

        "skeleton_Item_1_3": assets("tile-explorer/spine/Item_1_3.json"),
        "skeleton_Item_1_3_explosion": assets("tile-explorer/spine/Item_1_3_explosion.json"),

        "skeleton_Item_1_4": assets("tile-explorer/spine/Item_1_4.json"),
        "skeleton_Item_1_4_explosion": assets("tile-explorer/spine/Item_1_4_explosion.json"),

        "ice": assets("tile-explorer/spine/ice.json"),
      },
    },
  },
];
