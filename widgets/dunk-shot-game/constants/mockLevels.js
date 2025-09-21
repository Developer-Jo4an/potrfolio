import {MOCK} from "../../../shared/constants/mock/mock";

export const gameMockConfig = {
  "id": MOCK,
  "level": {
    "id": 1,
    "balls": 11
  },
  "game_type": 2,
  "boosters": {
    "x2": 0,
    "extra_life": 0,
    "clover": 0
  },
  "configuration": {
    "global_basket": {
      "burning_time": 450,
      "swing_angle": 45
    },
    "rows": [
      {
        "num": 16,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "left"
      },
      {
        "num": 14,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "center"
      },
      {
        "num": 12,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "right"
      },
      {
        "num": 11,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "left"
      },
      {
        "num": 10,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "center"
      },
      {
        "num": 8,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "left"
      },
      {
        "num": 6,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "right"
      },
      {
        "num": 5,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "left"
      },
      {
        "num": 3,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "center"
      },
      {
        "num": 2,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "right"
      },
      {
        "num": 1,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "center"
      }
    ]
  },
  "is_bonus_level": false
};

export const gameMockConfig1 = {
  "id": MOCK,
  "level": {
    "id": 2,
    "balls": 10
  },
  "game_type": 2,
  "boosters": {
    "x2": 0,
    "extra_life": 0,
    "clover": 0
  },
  "configuration": {
    "global_basket": {
      "burning_time": 450,
      "swing_angle": 45
    },
    "rows": [
      {
        "num": 15,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "center"
      },
      {
        "num": 13,
        "obj": "ethernal_basket",
        "speed": 1,
        "init_pos": "right"
      },
      {
        "num": 11,
        "obj": "ethernal_basket",
        "speed": 1,
        "init_pos": "left"
      },
      {
        "num": 9,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "center"
      },
      {
        "num": 7,
        "obj": "ethernal_basket",
        "speed": 1,
        "init_pos": "left"
      },
      {
        "num": 6,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "right"
      },
      {
        "num": 5,
        "obj": "ethernal_basket",
        "speed": 1,
        "init_pos": "center"
      },
      {
        "num": 4,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "left"
      },
      {
        "num": 3,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "right"
      },
      {
        "num": 1,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "center"
      }
    ]
  },
  "is_bonus_level": false
};

export const gameMockConfig2 = {
  "id": MOCK,
  "level": {
    "id": 3,
    "balls": 11
  },
  "game_type": 2,
  "boosters": {
    "x2": 0,
    "extra_life": 0,
    "clover": 0
  },
  "configuration": {
    "global_basket": {
      "burning_time": 450,
      "swing_angle": 45
    },
    "rows": [
      {
        "num": 17,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "right"
      },
      {
        "num": 15,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "center"
      },
      {
        "num": 13,
        "obj": "burning_basket",
        "speed": 1,
        "init_pos": "left"
      },
      {
        "num": 11,
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
        "num": 8,
        "obj": "ethernal_basket",
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
        "num": 5,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "left"
      },
      {
        "num": 4,
        "obj": "burning_basket",
        "speed": 0,
        "init_pos": "center"
      },
      {
        "num": 3,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "right"
      },
      {
        "num": 1,
        "obj": "ethernal_basket",
        "speed": 0,
        "init_pos": "center"
      }
    ]
  },
  "is_bonus_level": false
};

export const liteMockGames = [gameMockConfig, gameMockConfig1, gameMockConfig2];
