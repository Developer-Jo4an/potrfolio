import {LOSE, STATE_MACHINE, WIN} from "../controllers/constants/stateMachine";
import {MODES} from "@entities/game-end-modal";
import {getDefaultState, OFF, ON, ROUTES} from "@shared";

export default {
  background: {src: "widgets/doodle-jump-game/background.png", width: 1600, height: 900, quality: 75},
  menu: {
    lifes: {
      background: {
        img: {
          src: "widgets/doodle-jump-game/buttons/stats-button-bg.png",
          width: 64,
          height: 64,
          priority: true,
        },
      },
      img: {
        src: "widgets/doodle-jump-game/stats/lifes.png",
        width: 64,
        height: 64,
        priority: true,
      },
    },
    score: {
      background: {
        img: {
          src: "widgets/doodle-jump-game/buttons/stats-button-bg.png",
          width: 64,
          height: 64,
          priority: true,
        },
      },
      img: {
        src: "widgets/doodle-jump-game/stats/score.png",
        priority: true,
      },
    },
    pause: {
      background: {
        src: "widgets/doodle-jump-game/buttons/control-button-bg.png",
        width: 64,
        height: 64,
        priority: true,
      },
      mod: MODES.beige,
      buttons: [
        {
          id: ON,
          text: "Продолжить",
          className: "continueButton",
          background: {src: "widgets/doodle-jump-game/end-game/continue.png"},
        },
        {
          id: OFF,
          text: "На главную",
          className: "closeButton",
          background: {src: "widgets/doodle-jump-game/end-game/close.png"},
        },
      ],
    },
    sound: {
      background: {
        src: "widgets/doodle-jump-game/buttons/control-button-bg.png",
        priority: true,
      },
    },
  },
  endModal({status, wrapper, modalNames, distance, redirect}) {
    return {
      type: modalNames.gameEndModal,
      props: {
        background: {
          src: "widgets/doodle-jump-game/background.png",
          width: 512,
          height: 1024,
          quality: 50,
        },
        title: {
          status,
          text: {[WIN]: "Победа", [LOSE]: "Поражение"}[status],
          mod: MODES.beige,
        },
        img: {
          src: `widgets/doodle-jump-game/end-game/${status}.png`,
          width: 512,
          height: 512,
          quality: 25,
        },
        stats: {
          mod: MODES.beige,
          list: [
            {
              label: "Пройденное расстояние",
              img: "widgets/doodle-jump-game/stats/score.png",
              value: `${distance} px.`,
            },
          ],
        },
        buttons: {
          mod: MODES.beige,
          list: [
            {
              isDisposable: true,
              text: {[WIN]: "Продолжить", [LOSE]: "Реванш"}[status],
              background: {
                img: {
                  src: "widgets/doodle-jump-game/end-game/continue.png",
                  width: 512,
                  height: 64,
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
                  src: "widgets/doodle-jump-game/end-game/close.png",
                  width: 512,
                  height: 64
                }
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
