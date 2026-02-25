import {getDefaultState, OFF, ON, ROUTES} from "@shared";
import {BACK, HELP, MIX} from "../controllers/constants/boosters";
import {LOSE, STATE_MACHINE, WIN} from "../controllers/constants/stateMachine";
import {MODES as GAME_END_MODES} from "@entities/game-end-modal";
import {config} from "../config/config";
import {MODES} from "@entities/pause-modal";

export default {
  background: {src: "widgets/tile-explorer-game/background.png"},
  boosters: [
    {
      type: BACK,
      img: {src: "widgets/tile-explorer-game/backBooster.png", className: "boosterImage"},
      timeout: 1000,
      background: {className: "background", src: "widgets/tile-explorer-game/booster-background.png"}
    },
    {
      type: MIX,
      img: {src: "widgets/tile-explorer-game/mixBooster.png", className: "boosterImage"},
      timeout: 1000,
      background: {className: "background", src: "widgets/tile-explorer-game/booster-background.png"}
    },
    {
      type: HELP,
      img: {src: "widgets/tile-explorer-game/helpBooster.png", className: "boosterImage"},
      timeout: 1000,
      background: {className: "background", src: "widgets/tile-explorer-game/booster-background.png"}
    }
  ],
  menu: {
    lifes: {
      background: {
        img: {
          src: "widgets/tile-explorer-game/stats-button-background.png"
        }
      },
      img: {src: "widgets/tile-explorer-game/lifes-stat.png"}
    },
    score: {
      background: {
        img: {
          src: "widgets/tile-explorer-game/stats-button-background.png"
        }
      },
      img: {src: "widgets/tile-explorer-game/score-stat.png"}
    },
    pause: {
      background: {src: "widgets/tile-explorer-game/control-button-background.png"},
      mod: MODES.blue,
      buttons: [
        {
          id: ON,
          text: "Продолжить",
          className: "continueButton",
          background: {src: "widgets/tile-explorer-game/end-game/continue.png"}
        },
        {
          id: OFF,
          text: "На главную",
          className: "closeButton",
          background: {src: "widgets/tile-explorer-game/end-game/close.png"}
        }
      ]
    },
    sound: {background: {src: "widgets/tile-explorer-game/control-button-background.png"}}
  },
  endModal({status, wrapper, currentTime, modalNames, score, redirect}) {
    return {
      type: modalNames.gameEndModal,
      props: {
        background: {src: "widgets/game-cards/backgrounds/tileExplorer.png"},
        title: {text: {[WIN]: "Победа", [LOSE]: "Поражение"}[status], status, mod: GAME_END_MODES.blue},
        img: {src: `widgets/tile-explorer-game/end-game/${status}.png`},
        stats: {
          mod: GAME_END_MODES.blue,
          list: [
            {label: "Количество очко", img: "widgets/tile-explorer-game/stats/star.png", value: `+${score}`},
            {
              label: "Время",
              img: "widgets/tile-explorer-game/stats/lifes.png",
              value: `${config.timer - currentTime} c`
            }
          ]
        },
        buttons: {
          mod: GAME_END_MODES.blue,
          list: [
            {
              isDisposable: true,
              text: {[WIN]: "Продолжить", [LOSE]: "Реванш"}[status],
              background: {img: {src: "widgets/tile-explorer-game/end-game/continue.png"}},
              modalsData: {close: [{id: "active"}]},
              events: {
                async onClick() {
                  await wrapper.reset();
                  wrapper.state = getDefaultState(STATE_MACHINE);
                }
              }
            },
            {
              isDisposable: true,
              text: "Выйти",
              background: {img: {src: "widgets/tile-explorer-game/end-game/close.png"}},
              modalsData: {close: [{id: "active"}]},
              events: {
                onClick() {
                  redirect(ROUTES.index);
                }
              }
            }
          ]
        }
      }
    };
  }
};