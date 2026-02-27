import {Container, Sprite, TilingSprite} from "@shared";
import {ACTOR} from "../../constants/actor";
import {MAIN_CONTAINER} from "../../constants/mainContainer";
import {ROAD_CHUNK} from "../../constants/entities";
import {ROAD_CHUNKS_CONTAINER} from "../../constants/roadChunkContainer";

export const config = {
  [ACTOR]: {
    Cls: Sprite,
    baseSettings: {
      label: ACTOR,
      anchor: {x: 0.5, y: 0.5},
      texture: ACTOR,
    },
  },
  [MAIN_CONTAINER]: {
    Cls: Container,
    baseSettings: {
      label: MAIN_CONTAINER,
    },
  },
  [ROAD_CHUNK]: {
    Cls: TilingSprite,
    baseSettings: {
      label: ROAD_CHUNK,
      anchor: {x: 0.5, y: 1},
      texture: ROAD_CHUNK,
    },
  },
  [ROAD_CHUNKS_CONTAINER]: {
    Cls: Container,
    baseSettings: {
      label: ROAD_CHUNKS_CONTAINER,
    },
  },
};
