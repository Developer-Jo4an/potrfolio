import {getDefaultState, OFF, ON, ROUTES} from "@shared";
import {BACK, HELP, MIX} from "../controllers/constants/boosters";
import {LOSE, STATE_MACHINE, WIN} from "../controllers/constants/stateMachine";
import {MODES as GAME_END_MODES} from "@entities/game-end-modal";
import {config} from "../config/config";
import {MODES} from "@entities/pause-modal";

export default {
  background: {
    src: "widgets/tile-explorer-game/background.png",
    width: 1600,
    height: 900,
    quality: 75,
    priority: true,
  },
  menu: {
    lifes: {
      background: {
        img: {
          src: "widgets/tile-explorer-game/buttons/stats.png",
          width: 256,
          height: 256,
          priority: true,
        },
      },
      img: {
        src: "widgets/tile-explorer-game/stats/lifes.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
    score: {
      background: {
        img: {
          src: "widgets/tile-explorer-game/buttons/stats.png",
          width: 256,
          height: 256,
          priority: true,
        },
      },
      img: {
        src: "widgets/tile-explorer-game/stats/score.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
    pause: {
      background: {
        src: "widgets/tile-explorer-game/buttons/control.png",
        width: 256,
        height: 256,
        priority: true,
      },
      mod: MODES.blue,
      buttons: [
        {
          id: ON,
          text: "Продолжить",
          className: "continueButton",
          background: {
            src: "widgets/tile-explorer-game/end-game/continue.png",
            width: 512,
            height: 256,
          },
        },
        {
          id: OFF,
          text: "На главную",
          className: "closeButton",
          background: {
            src: "widgets/tile-explorer-game/end-game/close.png",
            width: 512,
            height: 256,
          },
        },
      ],
    },
    sound: {
      background: {
        src: "widgets/tile-explorer-game/buttons/control.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
  },
  boosters: [
    {
      type: BACK,
      timeout: 1000,
      img: {
        src: "widgets/tile-explorer-game/boosters/back.png",
        width: 256,
        height: 256,
        priority: true,
      },
      background: {
        src: "widgets/tile-explorer-game/buttons/booster.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
    {
      type: MIX,
      timeout: 1000,
      img: {
        src: "widgets/tile-explorer-game/boosters/mix.png",
        width: 256,
        height: 256,
        priority: true,
      },
      background: {
        src: "widgets/tile-explorer-game/buttons/booster.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
    {
      type: HELP,
      timeout: 1000,
      img: {
        src: "widgets/tile-explorer-game/boosters/help.png",
        width: 256,
        height: 256,
        priority: true,
      },
      background: {
        src: "widgets/tile-explorer-game/buttons/booster.png",
        width: 256,
        height: 256,
        priority: true,
      },
    },
  ],
  endModal({status, wrapper, currentTime, modalNames, score, redirect}) {
    return {
      type: modalNames.gameEndModal,
      props: {
        background: {
          src: "widgets/game-cards/backgrounds/tileExplorer.png",
          width: 512,
          height: 1024,
        },
        title: {
          status,
          text: {[WIN]: "Победа", [LOSE]: "Поражение"}[status],
          mod: GAME_END_MODES.blue,
        },
        img: {
          src: `widgets/tile-explorer-game/end-game/${status}.png`,
          width: 512,
          height: 512,
        },
        stats: {
          mod: GAME_END_MODES.blue,
          list: [
            {
              label: "Количество очко",
              img: "widgets/tile-explorer-game/stats/score.png",
              value: `+${score}`,
            },
            {
              label: "Время",
              img: "widgets/tile-explorer-game/stats/lifes.png",
              value: `${config.timer - currentTime} c`,
            },
          ],
        },
        buttons: {
          mod: GAME_END_MODES.blue,
          list: [
            {
              isDisposable: true,
              text: {[WIN]: "Продолжить", [LOSE]: "Реванш"}[status],
              background: {img: {src: "widgets/tile-explorer-game/end-game/continue.png", width: 512, height: 256}},
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
              background: {img: {src: "widgets/tile-explorer-game/end-game/close.png", width: 512, height: 256}},
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
