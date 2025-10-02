import {KD, PURE_COUNT, SCORE} from "./fields";
import {OFF, ON} from "../../../shared/constants/helpful/statuses";

export default {
  title: {
    win: "Победа",
    lose: "Поражение"
  },
  statsNames: {
    [PURE_COUNT]: "Чистые попадания",
    [KD]: "Попал/не попал",
    [SCORE]: "Очки"
  },
  buttons: [
    {
      id: ON,
      text: "Играть снова",
      className: "onButton"
    },
    {
      id: OFF,
      text: "На главную",
      className: "offButton"
    }
  ]
};