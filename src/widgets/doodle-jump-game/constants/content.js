import {LOSE, STATE_MACHINE, WIN} from "../controllers/constants/stateMachine";
import {MODES} from "@entities/game-end-modal";
import {getDefaultState, OFF, ON, ROUTES} from "@shared";

export default {
  background: {src: "widgets/doodle-jump-game/background.png"},
  menu: {
    lifes: {
      background: {img: {src: "widgets/doodle-jump-game/stats-button-background.png"}},
      img: {src: "widgets/doodle-jump-game/lifes-stat.png"},
    },
    score: {
      background: {img: {src: "widgets/doodle-jump-game/stats-button-background.png"}},
      img: {src: "widgets/doodle-jump-game/score-stat.png"},
    },
    pause: {
      background: {src: "widgets/doodle-jump-game/control-button-background.png"},
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
    sound: {background: {src: "widgets/doodle-jump-game/control-button-background.png"}},
  },
  endModal({status, wrapper, modalNames, distance, redirect}) {
    return {
      type: modalNames.gameEndModal,
      props: {
        background: {src: "widgets/game-cards/backgrounds/doodleJump.png"},
        title: {text: {[WIN]: "Победа", [LOSE]: "Поражение"}[status], status, mod: MODES.beige},
        img: {src: `widgets/doodle-jump-game/end-game/${status}.png`},
        stats: {
          mod: MODES.beige,
          list: [
            {label: "Пройденное расстояние", img: "widgets/doodle-jump-game/stats/score.png", value: `${distance} px.`},
          ],
        },
        buttons: {
          mod: MODES.beige,
          list: [
            {
              isDisposable: true,
              text: {[WIN]: "Продолжить", [LOSE]: "Реванш"}[status],
              background: {img: {src: "widgets/doodle-jump-game/end-game/continue.png"}},
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
              background: {img: {src: "widgets/doodle-jump-game/end-game/close.png"}},
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
