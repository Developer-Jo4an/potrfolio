import {TbMultiplier2X} from "react-icons/tb";
import {FaHeartCirclePlus} from "react-icons/fa6";
import {GiFluffyWing} from "react-icons/gi";

import {CLOVER, EXTRA_LIFE, X2} from "./boosters";

export default {
  boosters: [
    {
      booster: X2,
      Icon: TbMultiplier2X
    },
    {
      booster: EXTRA_LIFE,
      Icon: FaHeartCirclePlus
    },
    {
      booster: CLOVER,
      Icon: GiFluffyWing
    }
  ]
};