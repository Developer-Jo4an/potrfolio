import {getDefaultState, ROUTES, OFF, ON} from "@shared";
import {MODES as GAME_END_MODES} from "@entities/game-end-modal";
import {STATE_MACHINE, LOSE, WIN} from "../controllers/constants/stateMachine";
import {WINGS, EXTRA_LIFE, X2} from "../controllers/constants/boosters";
import {MODES} from "@entities/pause-modal";

export default {
  background: {
    src: "widgets/dunk-shot-game/background.png",
    width: 1600,
    height: 900,
    priority: true,
  },
  menu: {
    lifes: {
      background: {
        img: {
          src: "widgets/dunk-shot-game/buttons/stats.png",
          width: 256,
          height: 256,
          priority: true,
        },
      },
      img: {
        src: "widgets/dunk-shot-game/stats/lifes.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
    score: {
      background: {
        img: {
          src: "widgets/dunk-shot-game/buttons/stats.png",
          width: 256,
          height: 256,
          priority: true,
        },
      },
      img: {
        src: "widgets/dunk-shot-game/stats/score.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
    pause: {
      mod: MODES.ocean,
      background: {
        src: "widgets/dunk-shot-game/buttons/control.png",
        width: 256,
        height: 256,
        priority: true,
      },
      buttons: [
        {
          id: ON,
          text: "Продолжить",
          className: "continueButton",
          background: {
            src: "widgets/dunk-shot-game/end-game/continue.png",
            width: 512,
            height: 256,
          },
        },
        {
          id: OFF,
          text: "На главную",
          className: "closeButton",
          background: {
            src: "widgets/dunk-shot-game/end-game/close.png",
            width: 512,
            height: 256,
          },
        },
      ],
    },
    sound: {
      background: {
        src: "widgets/dunk-shot-game/buttons/control.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
  },
  effects: {
    pure: {
      img: {
        src: "widgets/dunk-shot-game/effects/pure.png",
        width: 512,
        height: 256,
      },
    },
  },
  boosters: [
    {
      type: X2,
      timeout: 1000,
      img: {
        src: "widgets/dunk-shot-game/boosters/x2.png",
        width: 256,
        height: 256,
        priority: true,
      },
      background: {
        src: "widgets/dunk-shot-game/buttons/booster.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
    {
      type: EXTRA_LIFE,
      timeout: 1000,
      img: {
        src: "widgets/dunk-shot-game/boosters/extra-life.png",
        width: 256,
        height: 256,
        priority: true,
      },
      background: {
        src: "widgets/dunk-shot-game/buttons/booster.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
    {
      type: WINGS,
      timeout: 1000,
      img: {
        src: "widgets/dunk-shot-game/boosters/wings.png",
        width: 256,
        height: 256,
        priority: true,
      },
      background: {
        src: "widgets/dunk-shot-game/buttons/booster.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
  ],
  endModal({status, modalNames, wrapper, score, story, pureCount, redirect}) {
    return {
      type: modalNames.gameEndModal,
      props: {
        background: {
          src: "widgets/dunk-shot-game/background.png",
          width: 512,
          height: 1024,
        },
        title: {text: {[WIN]: "Победа", [LOSE]: "Поражение"}[status], status, mod: GAME_END_MODES.ocean},
        img: {src: `widgets/dunk-shot-game/end-game/${status}.png`, width: 512, height: 256},
        stats: {
          mod: GAME_END_MODES.ocean,
          list: [
            {
              label: "Количество очко",
              img: "widgets/dunk-shot-game/stats/score.png",
              value: `+${score}`,
            },
            {
              label: "Заброшенные мячи",
              img: "widgets/dunk-shot-game/stats/ball.png",
              value: `${story.reduce((acc, isHit) => acc + +isHit, 0)}/${story.length}`,
            },
            {
              label: "Чистые попадания",
              value: pureCount,
            },
          ],
        },
        buttons: {
          mod: GAME_END_MODES.ocean,
          list: [
            {
              isDisposable: true,
              text: {[WIN]: "Продолжить", [LOSE]: "Реванш"}[status],
              background: {img: {src: "widgets/dunk-shot-game/end-game/continue.png", width: 512, height: 256}},
              modalsData: {close: [{id: "active"}]},
              events: {
                async onClick() {
                  await wrapper.reset();
                  wrapper.state = getDefaultState(STATE_MACHINE);
                },
              },
            },
            {
              isDisposable: true,
              text: "Выйти",
              background: {img: {src: "widgets/dunk-shot-game/end-game/close.png", width: 512, height: 256}},
              modalsData: {close: [{id: "active"}]},
              events: {
                onClick() {
                  redirect(ROUTES.index);
                },
              },
            },
          ],
        },
      },
    };
  },
};
