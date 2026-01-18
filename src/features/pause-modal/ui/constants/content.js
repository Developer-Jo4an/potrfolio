import {OFF, ON} from "../../../../shared/constants/src/helpful/statuses";

export default {
  title: "Пауза",
  description: "А как же воля к победе? Нужно обязательно пройти уровень до конца, а если выходишь, то возвращайся!",
  buttons: [
    {
      id: ON,
      text: "Играть дальше",
      className: "onButton"
    },
    {
      id: OFF,
      text: "На главную",
      className: "offButton"
    }
  ]
};