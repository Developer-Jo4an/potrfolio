import {KD, PURE_COUNT, SCORE} from "../constants/fields";
import {isFunction} from "lodash";
import {FaStar} from "react-icons/fa6";
import {RiScales3Fill} from "react-icons/ri";
import {FaCheckCircle} from "react-icons/fa";

export function formatStats({pureCount, score, kd}) {
  return [
    {key: SCORE, value: score, Icon: FaStar},
    {key: KD, value: kd, Icon: RiScales3Fill},
    {key: PURE_COUNT, value: pureCount, Icon: FaCheckCircle}
  ];
}

export function formatStatValue(key, value) {
  const keys = {
    [SCORE]() {
      return `+${value}`;
    },
    [KD]() {
      return `${value.hit}/${value.miss}`;
    }
  };

  return isFunction(keys[key]) ? keys[key]() : value;
}