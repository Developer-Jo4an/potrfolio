import {MODES} from "@entities/pause-modal";
import {OFF, ON} from "@shared";

export default {
  background: {src: "widgets/car-game/background.png"},
  menu: {
    lifes: {
      background: {img: {src: "widgets/car-game/stats-button-background.png"}},
      img: {src: "widgets/car-game/lifes-stat.png"},
    },
    score: {
      background: {img: {src: "widgets/car-game/stats-button-background.png"}},
      img: {src: "widgets/car-game/score-stat.png"},
    },
    pause: {
      background: {src: "widgets/car-game/control-button-background.png"},
      mod: MODES.sand,
      buttons: [
        {
          id: ON,
          text: "Продолжить",
          className: "continueButton",
          background: {src: "widgets/car-game/end-game/continue.png"},
        },
        {
          id: OFF,
          text: "На главную",
          className: "closeButton",
          background: {src: "widgets/car-game/end-game/close.png"},
        },
      ],
    },
    sound: {background: {src: "widgets/car-game/control-button-background.png"}},
  },
  endModal() {},
};
