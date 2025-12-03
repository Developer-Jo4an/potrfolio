import {DEVELOPMENT} from "../../constants/build/env";
import getQueryParams from "../search/getQueryParams";

export default function getIsDebug() {
  const result = getQueryParams(window.location.search);
  return result.hasOwnProperty("debug") && process.env.NODE_ENV === DEVELOPMENT;
}