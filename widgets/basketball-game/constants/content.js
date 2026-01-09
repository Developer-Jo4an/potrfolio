import {CLEAR_HIT, EXTRA_LIFE, X2} from "./boosters";

export default {
  boosters: [
    {
      type: CLEAR_HIT,
      className: "clearHit",
      img: "widgets/basketball-game/clearHitBooster.png"
    },
    {
      type: EXTRA_LIFE,
      className: "extraLife",
      img: "widgets/basketball-game/extraLifeBooster.png"
    },
    {
      type: X2,
      className: "x2",
      img: "widgets/basketball-game/x2Booster.png"
    }
  ]
};