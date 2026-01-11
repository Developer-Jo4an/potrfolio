import {CLEAR_HIT, EXTRA_LIFE, X2} from "./boosters";
import {OFF, ON} from "../../../shared/constants/helpful/statuses";

export default {
  boosters: [
    {
      type: CLEAR_HIT,
      img: {src: "widgets/basketball-game/clearHitBooster.png", className: "boosterImage"},
      timeout: 1000,
      background: {
        className: "background",
        src: "widgets/basketball-game/booster-background.png"
      }
    },
    {
      type: EXTRA_LIFE,
      img: {src: "widgets/basketball-game/extraLifeBooster.png", className: "boosterImage"},
      timeout: 1000,
      background: {
        className: "background",
        src: "widgets/basketball-game/booster-background.png"
      }
    },
    {
      type: X2,
      img: {src: "widgets/basketball-game/x2Booster.png", className: "boosterImage"},
      timeout: 1000,
      background: {
        className: "background",
        src: "widgets/basketball-game/booster-background.png"
      }
    }
  ],
  background: {
    src: "widgets/basketball-game/background.png"
  },
  menu: {
    lifes: {
      background: {
        img: {src: "widgets/basketball-game/stats-button-background.png"}
      },
      img: {
        src: "widgets/basketball-game/lifes-stat.png"
      }
    },
    score: {
      background: {
        img: {src: "widgets/basketball-game/stats-button-background.png"}
      },
      img: {
        src: "widgets/basketball-game/score-stat.png"
      }
    },
    pause: {
      background: {
        src: "widgets/basketball-game/control-button-background.png"
      },
      buttons: [
        {
          id: ON,
          text: "Продолжить",
          className: "continueButton",
          background: {
            src: "widgets/basketball-game/continue-button.png"
          }
        },
        {
          id: OFF,
          text: "На главную",
          className: "closeButton",
          background: {
            src: "widgets/basketball-game/close-button.png"
          }
        }
      ]
    },
    sound: {
      background: {
        src: "widgets/basketball-game/control-button-background.png"
      }
    }
  },
  effects: {
    clearHit: {
      img: {
        src: "widgets/basketball-game/clearHit.png"
      }
    },
    miss: {
      img: {
        src: "widgets/basketball-game/miss.png"
      }
    }
  }
};