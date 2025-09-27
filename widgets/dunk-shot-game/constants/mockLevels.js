import {MOCK} from "../../../shared/constants/mock/mock";

export const gameMockConfig = {
  "id": MOCK,
  "level": {
    "id": 4,
    "balls": 14
  },
  "game_type": 2,
  "boosters": {
    "x2": 100,
    "extra_life": 102,
    "wings": 97
  },
  "configuration": {
    "global_basket": {
      "burning_time": 450,
      "swing_angle": 45
    },
    "rows": [
      {
        "num": 1,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "center"
      },
      {
        "num": 2,
        "obj": "spike",
        "speed": 1,
        "init_pos": "right"
      },
      {
        "num": 3,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "right"
      },
      {
        "num": 4,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "center"
      },
      {
        "num": 5,
        "obj": "spike",
        "speed": 1,
        "init_pos": "center"
      },
      {
        "num": 6,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "right"
      },
      {
        "num": 7,
        "obj": "ethernal_basket",
        "speed": 1,
        "init_pos": "left"
      },
      {
        "num": 8,
        "obj": "spike",
        "speed": 1,
        "init_pos": "center"
      },
      {
        "num": 9,
        "obj": "ethernal_basket",
        "speed": 1,
        "init_pos": "center"
      },
      {
        "num": 10,
        "obj": "burning_basket",
        "speed": 0,
        "init_pos": "right"
      },
      {
        "num": 11,
        "obj": "ethernal_basket",
        "speed": 1,
        "init_pos": "center"
      },
      {
        "num": 12,
        "obj": "ethernal_basket",
        "speed": 2,
        "init_pos": "left"
      },
      {
        "num": 14,
        "obj": "burning_basket",
        "speed": 1,
        "init_pos": "center"
      },
      {
        "num": 16,
        "obj": "ethernal_basket",
        "speed": 2,
        "init_pos": "right"
      }
    ]
  },
  "is_bonus_level": false
}
