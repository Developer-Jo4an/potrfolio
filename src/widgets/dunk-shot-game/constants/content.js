import {getDefaultState, INDEX, OFF, ON} from "@shared";
import {MODAL_NAMES} from "@application/providers/modal";
import {MODS} from "@features/game-end-modal";
import {DUNK_SHOT_STATE_MACHINE, LOSE, WIN} from "./stateMachine";
import {WINGS, EXTRA_LIFE, X2} from "./boosters";

export default {
  boosters: [
    {
      type: X2,
      img: {src: "widgets/dunk-shot-game/x2Booster.png", className: "boosterImage"},
      background: {className: "background", src: "widgets/dunk-shot-game/booster-background.png"},
      timeout: 1000,
    },
    {
      type: EXTRA_LIFE,
      img: {src: "widgets/dunk-shot-game/extraLifeBooster.png", className: "boosterImage"},
      timeout: 1000,
      background: {className: "background", src: "widgets/dunk-shot-game/booster-background.png"},
    },
    {
      type: WINGS,
      img: {src: "widgets/dunk-shot-game/wingsBooster.png", className: "boosterImage"},
      timeout: 1000,
      background: {className: "background", src: "widgets/dunk-shot-game/booster-background.png"},
    },
  ],
  background: {
    src: "widgets/dunk-shot-game/background.png",
  },
  menu: {
    lifes: {
      background: {img: {src: "widgets/dunk-shot-game/stats-button-background.png"}},
      img: {src: "widgets/dunk-shot-game/lifes-stat.png"},
    },
    score: {
      background: {img: {src: "widgets/dunk-shot-game/stats-button-background.png"}},
      img: {src: "widgets/dunk-shot-game/score-stat.png"},
    },
    pause: {
      background: {src: "widgets/dunk-shot-game/control-button-background.png"},
      buttons: [
        {
          id: ON,
          text: "Продолжить",
          className: "continueButton",
          background: {src: "widgets/dunk-shot-game/end-game/continue.png"},
        },
        {
          id: OFF,
          text: "На главную",
          className: "closeButton",
          background: {src: "widgets/dunk-shot-game/end-game/close.png"},
        },
      ],
    },
    sound: {background: {src: "widgets/dunk-shot-game/control-button-background.png"}},
  },
  endModal({status, wrapper, score, story, pureCount, redirect}) {
    return {
      type: MODAL_NAMES.gameEndModal,
      props: {
        background: {src: "widgets/game-cards/backgrounds/dunkShot.png"},
        title: {text: {[WIN]: "Победа", [LOSE]: "Поражение"}[status], status, mod: MODS.ocean},
        img: {src: `widgets/dunk-shot-game/end-game/${status}.png`, mod: MODS.ocean},
        stats: {
          mod: MODS.ocean,
          list: [
            {label: "Количество очко", img: "widgets/dunk-shot-game/stats/star.png", value: `+${score}`},
            {
              label: "Заброшенные мячи",
              img: "widgets/dunk-shot-game/stats/ball.png",
              value: `${story.reduce((acc, isHit) => acc + +isHit, 0)}/${story.length}`,
            },
            {label: "Чистые попадания", value: pureCount},
          ],
        },
        buttons: {
          mod: MODS.ocean,
          list: [
            {
              isDisposable: true,
              text: {[WIN]: "Продолжить", [LOSE]: "Реванш"}[status],
              background: {img: {src: "widgets/dunk-shot-game/end-game/continue.png"}},
              modalsData: {close: [{id: "active"}]},
              events: {
                async onClick() {
                  await wrapper.reset();
                  wrapper.state = getDefaultState(DUNK_SHOT_STATE_MACHINE);
                },
              },
            },
            {
              isDisposable: true,
              text: "Выйти",
              background: {img: {src: "widgets/dunk-shot-game/end-game/close.png"}},
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
