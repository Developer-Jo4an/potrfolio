import {CLEAR_HIT, EXTRA_LIFE, X2} from "../controllers/constants/boosters";
import {OFF, ON, ROUTES, getDefaultState} from "@shared";
import {MODES as GAME_END_MODES} from "@entities/game-end-modal";
import {STATE_MACHINE, LOSE, WIN} from "../controllers/constants/stateMachine";
import {MODES} from "@entities/pause-modal";

export default {
  background: {
    src: "widgets/basketball-game/background.png",
    width: 1600,
    height: 900,
    priority: true,
  },
  menu: {
    lifes: {
      background: {
        img: {
          src: "widgets/basketball-game/buttons/stats.png",
          width: 256,
          height: 256,
          priority: true,
        },
      },
      img: {
        src: "widgets/basketball-game/stats/lifes.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
    score: {
      background: {
        img: {
          src: "widgets/basketball-game/buttons/stats.png",
          width: 256,
          height: 256,
          priority: true,
        },
      },
      img: {
        src: "widgets/basketball-game/stats/score.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
    pause: {
      mod: MODES.orange,
      background: {
        src: "widgets/basketball-game/buttons/control.png",
        priority: true,
        width: 256,
        height: 256,
      },
      buttons: [
        {
          id: ON,
          text: "Продолжить",
          className: "continueButton",
          background: {
            src: "widgets/basketball-game/end-game/continue.png",
            width: 512,
            height: 256,
          },
        },
        {
          id: OFF,
          text: "На главную",
          className: "closeButton",
          background: {
            src: "widgets/basketball-game/end-game/close.png",
            width: 512,
            height: 256,
          },
        },
      ],
    },
    sound: {
      background: {
        src: "widgets/basketball-game/buttons/control.png",
        priority: true,
        width: 256,
        height: 256,
      },
    },
  },

  effects: {
    clearHit: {
      img: {
        src: "widgets/basketball-game/effects/clear-hit.png",
        width: 512,
        height: 256,
      },
    },
    miss: {
      img: {
        src: "widgets/basketball-game/effects/miss.png",
        width: 512,
        height: 256,
      },
    },
  },
  boosters: [
    {
      type: CLEAR_HIT,
      timeout: 1000,
      img: {
        src: "widgets/basketball-game/boosters/clear-hit.png",
        width: 256,
        height: 256,
        priority: true,
      },
      background: {
        src: "widgets/basketball-game/buttons/booster.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
    {
      type: EXTRA_LIFE,
      timeout: 1000,
      img: {
        src: "widgets/basketball-game/boosters/extra-life.png",
        width: 256,
        height: 256,
        priority: true,
      },
      background: {
        src: "widgets/basketball-game/buttons/booster.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
    {
      type: X2,
      timeout: 1000,
      img: {
        src: "widgets/basketball-game/boosters/x2.png",
        width: 256,
        height: 256,
        priority: true,
      },
      background: {
        src: "widgets/basketball-game/buttons/booster.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
  ],
  endModal({status, wrapper, modalNames, score, story, pureCount, redirect}) {
    return {
      type: modalNames.gameEndModal,
      props: {
        background: {
          src: "widgets/game-cards/backgrounds/basketball.png",
          width: 512,
          height: 1024,
        },
        title: {
          status,
          text: {[WIN]: "Победа", [LOSE]: "Поражение"}[status],
          mod: GAME_END_MODES.velvet,
        },
        img: {
          src: `widgets/basketball-game/end-game/${status}.png`,
          width: 512,
          height: 256,
        },
        stats: {
          mod: GAME_END_MODES.velvet,
          list: [
            {
              label: "Количество очко",
              img: "widgets/basketball-game/stats/score.png",
              value: `+${score}`,
            },
            {
              label: "Заброшенные мячи",
              img: "widgets/basketball-game/stats/ball.png",
              value: `${story.reduce((acc, isHit) => acc + +isHit, 0)}/${story.length}`,
            },
            {
              label: "Чистые попадания",
              value: pureCount,
            },
          ],
        },
        buttons: {
          mod: GAME_END_MODES.velvet,
          list: [
            {
              isDisposable: true,
              text: {[WIN]: "Продолжить", [LOSE]: "Реванш"}[status],
              background: {
                img: {
                  src: "widgets/basketball-game/end-game/continue.png",
                  width: 512,
                  height: 256,
                },
              },
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
              background: {
                img: {
                  src: "widgets/basketball-game/end-game/close.png",
                  width: 512,
                  height: 256,
                },
              },
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
