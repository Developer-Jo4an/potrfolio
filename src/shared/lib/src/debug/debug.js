import {DEVELOPMENT} from "../../../constants";
import {getQueryParams} from "../search/getQueryParams";

export function getIsDebug() {
  const result = getQueryParams(global.location.search);
  return result.hasOwnProperty("debug") && process.env.NODE_ENV === DEVELOPMENT;
}
