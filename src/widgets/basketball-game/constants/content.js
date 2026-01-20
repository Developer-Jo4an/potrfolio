import {CLEAR_HIT, EXTRA_LIFE, X2} from "./boosters";
import {OFF, ON, INDEX, getDefaultState} from "@shared";
import {MODAL_NAMES} from "@application/providers/modal";
import {MODS} from "../../../features/game-end-modal";
import {BASKETBALL_STATE_MACHINE, LOSE, WIN} from "./stateMachine";

export default {
  boosters: [
    {
      type: CLEAR_HIT,
      img: {src: "widgets/basketball-game/clearHitBooster.png", className: "boosterImage"},
      timeout: 1000,
      background: {className: "background", src: "widgets/basketball-game/booster-background.png"},
    },
    {
      type: EXTRA_LIFE,
      img: {src: "widgets/basketball-game/extraLifeBooster.png", className: "boosterImage"},
      timeout: 1000,
      background: {className: "background", src: "widgets/basketball-game/booster-background.png"},
    },
    {
      type: X2,
      img: {src: "widgets/basketball-game/x2Booster.png", className: "boosterImage"},
      timeout: 1000,
      background: {className: "background", src: "widgets/basketball-game/booster-background.png"},
    },
  ],
  background: {src: "widgets/basketball-game/background.png"},
  menu: {
    lifes: {
      background: {img: {src: "widgets/basketball-game/stats-button-background.png"}},
      img: {src: "widgets/basketball-game/lifes-stat.png"},
    },
    score: {
      background: {img: {src: "widgets/basketball-game/stats-button-background.png"}},
      img: {src: "widgets/basketball-game/score-stat.png"},
    },
    pause: {
      background: {src: "widgets/basketball-game/control-button-background.png"},
      buttons: [
        {
          id: ON,
          text: "Продолжить",
          className: "continueButton",
          background: {src: "widgets/basketball-game/end-game/continue.png"},
        },
        {
          id: OFF,
          text: "На главную",
          className: "closeButton",
          background: {src: "widgets/basketball-game/end-game/close.png"},
        },
      ],
    },
    sound: {background: {src: "widgets/basketball-game/control-button-background.png"}},
  },
  effects: {
    clearHit: {img: {src: "widgets/basketball-game/clearHit.png"}},
    miss: {img: {src: "widgets/basketball-game/miss.png"}},
  },
  endModal({status, wrapper, score, story, pureCount, redirect}) {
    return {
      type: MODAL_NAMES.gameEndModal,
      props: {
        background: {src: "widgets/game-cards/backgrounds/basketball.png"},
        title: {text: {[WIN]: "Победа", [LOSE]: "Поражение"}[status], status, mod: MODS.velvet},
        img: {src: `widgets/basketball-game/end-game/${status}.png`},
        stats: {
          mod: MODS.velvet,
          list: [
            {label: "Количество очко", img: "widgets/basketball-game/stats/star.png", value: `+${score}`},
            {
              label: "Заброшенные мячи",
              img: "widgets/basketball-game/stats/ball.png",
              value: `${story.reduce((acc, isHit) => acc + +isHit, 0)}/${story.length}`,
            },
            {label: "Чистые попадания", value: pureCount},
          ],
        },
        buttons: {
          mod: MODS.velvet,
          list: [
            {
              isDisposable: true,
              text: {[WIN]: "Продолжить", [LOSE]: "Реванш"}[status],
              background: {img: {src: "widgets/basketball-game/end-game/continue.png"}},
              modalsData: {close: [{id: "active"}]},
              events: {
                async onClick() {
                  await wrapper.reset();
                  wrapper.state = getDefaultState(BASKETBALL_STATE_MACHINE);
                },
              },
            },
            {
              isDisposable: true,
              text: "Выйти",
              background: {img: {src: "widgets/basketball-game/end-game/close.png"}},
              modalsData: {close: [{id: "active"}]},
              events: {
                onClick() {
                  redirect(INDEX);
                },
              },
            },
          ],
        },
      },
    };
  },
};
