import {DEVELOPMENT} from "../../constants/src/build/env";
import getQueryParams from "../search/getQueryParams";

export default function getIsDebug() {
  const result = getQueryParams(global.location.search);
  return result.hasOwnProperty("debug") && process.env.NODE_ENV === DEVELOPMENT;
}