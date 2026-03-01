import {cloneDeep} from "lodash";
import {spring} from "./boosters/spring";
import {propeller} from "./boosters/propeller";
import {jetpack} from "./boosters/jetpack";
import {trampoline} from "./helpers/trampoline";
import {v4 as uuidv4} from "uuid";
import {PLATFORM, PlatformTextures} from "../../entities/platform";
import {ENEMY, EnemyBehaviours, EnemyTextures} from "../../entities/enemy";

const complexityConfig = {
  target: 10000,
  waves: [
    {
      length: Infinity,
      combinations: [
        /**
         * Просто платформы без children
         */
        {
          weight: 1,
          distanceBetween: [100, 150],
          entities: [
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM0,
              isTrackCollision: true,
              x: [0, 1],
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 8,
            },
          ],
        },
        {
          weight: 1,
          distanceBetween: [100, 150],
          entities: [
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM2,
              isTrackCollision: true,
              x: {min: 0, max: 1, speed: 200},
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 8,
            },
          ],
        },
        {
          weight: 1,
          distanceBetween: [100, 150],
          entities: [
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM1,
              isTrackCollision: false,
              yOffset: 0,
              x: [0, 0.33],
              size: {width: 90, height: 20},
              count: 1,
            },
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM3,
              isTrackCollision: true,
              x: [0.66, 1],
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 1,
            },
          ],
        },
        {
          weight: 1,
          distanceBetween: [100, 150],
          entities: [
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM3,
              isTrackCollision: true,
              x: [0, 1],
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 1,
            },
          ],
        },
        /**
         * Платформы с хелперами
         */
        {
          weight: 0.1,
          distanceBetween: [100, 150],
          entities: [
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM0,
              isTrackCollision: true,
              x: [0, 1],
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 8,
              children: [trampoline()],
            },
          ],
        },
        /**
         * Платформы с бустерами
         */
        {
          weight: 0.1,
          distanceBetween: [100, 150],
          entities: [
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM0,
              isTrackCollision: true,
              x: [0, 1],
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 8,
              children: [spring()],
            },
          ],
        },
        {
          weight: 0.1,
          distanceBetween: [100, 150],
          entities: [
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM0,
              isTrackCollision: true,
              x: [0, 1],
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 8,
              children: [propeller()],
            },
          ],
        },
        {
          weight: 0.1,
          distanceBetween: [100, 150],
          entities: [
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM0,
              isTrackCollision: true,
              x: [0, 1],
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 8,
              children: [jetpack()],
            },
          ],
        },
        /**
         * Платформы с врагами
         */
        /**
         * Огромный моб
         */
        {
          weight: 2,
          distanceBetween: [100, 150],
          entities: [
            {
              type: ENEMY,
              texture: EnemyTextures.ENEMY0,
              isTrackCollision: true,
              size: {width: 140, height: 86},
              count: 2,
              behaviour: {
                type: EnemyBehaviours.STATIC,
                props: {
                  x: [0.1, 0.2],
                  yOffset: -37,
                },
              },
            },
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM0,
              isTrackCollision: true,
              x: [0.65, 1],
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 8,
            },
          ],
        },
        {
          weight: 0.05,
          distanceBetween: [100, 150],
          entities: [
            {
              type: ENEMY,
              texture: EnemyTextures.ENEMY0,
              isTrackCollision: true,
              size: {width: 140, height: 86},
              count: 2,
              behaviour: {
                type: EnemyBehaviours.STATIC,
                props: {
                  x: [0.8, 0.9],
                  yOffset: -37,
                },
              },
            },
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM0,
              isTrackCollision: true,
              x: [0, 0.35],
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 8,
            },
          ],
        },
        /**
         * Синяя муха
         */
        {
          weight: 0.05,
          distanceBetween: [100, 150],
          entities: [
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM3,
              isTrackCollision: true,
              x: [0, 0.4],
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 1,
            },
            {
              type: ENEMY,
              texture: EnemyTextures.ENEMY1,
              isTrackCollision: true,
              size: {width: 90, height: 53},
              count: 1,
              behaviour: {
                type: EnemyBehaviours.MOVE,
                props: {
                  x: {min: 0.7, max: 1, speed: 200},
                  yOffset: -20,
                },
              },
            },
          ],
        },
        {
          weight: 0.05,
          distanceBetween: [100, 150],
          entities: [
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM0,
              isTrackCollision: true,
              x: [0.6, 1],
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 1,
            },
            {
              type: ENEMY,
              texture: EnemyTextures.ENEMY1,
              isTrackCollision: true,
              size: {width: 90, height: 53},
              count: 1,
              behaviour: {
                type: EnemyBehaviours.MOVE,
                props: {
                  x: {min: 0, max: 0.3, speed: 200},
                  yOffset: -20,
                },
              },
            },
          ],
        },
        /**
         * Фиолетовая муха
         */
        {
          weight: 0.05,
          distanceBetween: [100, 150],
          entities: [
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM2,
              isTrackCollision: true,
              x: {min: 0, max: 0.5, speed: 100},
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 8,
            },
            {
              type: ENEMY,
              texture: EnemyTextures.ENEMY2,
              isTrackCollision: true,
              size: {width: 60, height: 51},
              count: 1,
              behaviour: {
                type: EnemyBehaviours.TREMBLE,
                props: {
                  x: 0.85,
                  yOffset: 0,
                  radius: 25,
                  pointsCount: 10,
                  speed: 350,
                },
              },
            },
          ],
        },
        {
          weight: 0.05,
          distanceBetween: [100, 150],
          entities: [
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM2,
              isTrackCollision: true,
              x: {min: 0.5, max: 1, speed: 100},
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 8,
            },
            {
              type: ENEMY,
              texture: EnemyTextures.ENEMY2,
              isTrackCollision: true,
              size: {width: 60, height: 51},
              count: 1,
              behaviour: {
                type: EnemyBehaviours.TREMBLE,
                props: {
                  x: 0.15,
                  yOffset: 0,
                  radius: 25,
                  pointsCount: 10,
                  speed: 350,
                },
              },
            },
          ],
        },
        /**
         * Микроб
         */
        {
          weight: 0.05,
          distanceBetween: [100, 150],
          entities: [
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM2,
              isTrackCollision: true,
              x: {min: 0, max: 0.35, speed: 100},
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 8,
              children: [
                {
                  type: ENEMY,
                  texture: EnemyTextures.ENEMY3,
                  isTrackCollision: true,
                  size: {width: 60, height: 51},
                  count: 1,
                  behaviour: {
                    type: EnemyBehaviours.FOLLOW,
                    props: {
                      offset: {
                        x: 0,
                        y: -36,
                      },
                    },
                  },
                },
              ],
            },
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM2,
              isTrackCollision: true,
              x: {min: 0.7, max: 1, speed: 100},
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 8,
            },
          ],
        },
        {
          weight: 0.05,
          distanceBetween: [100, 150],
          entities: [
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM2,
              isTrackCollision: true,
              x: {min: 0.65, max: 1, speed: 100},
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 8,
              children: [
                {
                  type: ENEMY,
                  texture: EnemyTextures.ENEMY3,
                  isTrackCollision: true,
                  size: {width: 60, height: 51},
                  count: 1,
                  behaviour: {
                    type: EnemyBehaviours.FOLLOW,
                    props: {
                      offset: {
                        x: 0,
                        y: -36,
                      },
                    },
                  },
                },
              ],
            },
            {
              type: PLATFORM,
              texture: PlatformTextures.PLATFORM2,
              isTrackCollision: true,
              x: {min: 0, max: 0.3, speed: 100},
              yOffset: 0,
              size: {width: 90, height: 20},
              count: 8,
            },
          ],
        },
      ],
    },
  ],
  wiredCombinations: [
    {
      order: 1,
      distanceBetween: 150,
      entities: [
        {
          type: PLATFORM,
          texture: PlatformTextures.PLATFORM0,
          x: 0.5,
          yOffset: 0,
          isTrackCollision: true,
          size: {width: 90, height: 20},
          count: Number.MAX_VALUE,
        },
      ],
    },
    {
      order: 2,
      distanceBetween: 150,
      entities: [
        {
          type: PLATFORM,
          texture: PlatformTextures.PLATFORM0,
          x: 0.5,
          yOffset: 0,
          isTrackCollision: true,
          size: {width: 90, height: 20},
          count: 8,
        },
      ],
    },
    {
      order: 3,
      distanceBetween: 150,
      entities: [
        {
          type: PLATFORM,
          texture: PlatformTextures.PLATFORM3,
          x: 0.5,
          yOffset: 0,
          isTrackCollision: true,
          size: {width: 90, height: 20},
          count: 1,
        },
      ],
    },
  ],
};

export const complexity = cloneDeep(
  Object.entries(complexityConfig).reduce((acc, [key, value]) => {
    switch (key) {
      case "waves": {
        acc[key] = value.map((waveData) => {
          const {combinations} = waveData;
          return {
            ...waveData,
            combinations: combinations.map((combination) => ({...combination, id: uuidv4()})),
          };
        });
        break;
      }

      case "wiredCombinations": {
        acc[key] = value.map((combination) => ({...combination, id: uuidv4()}));
        break;
      }

      default: {
        acc[key] = value;
      }
    }
    return acc;
  }, {}),
);
