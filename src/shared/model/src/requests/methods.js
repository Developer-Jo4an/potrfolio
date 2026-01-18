import {isFinite} from "lodash";
import axios from "axios";
import {API, GET, POST} from "../../../constants";

export const get = createMethod(GET);
export const post = createMethod(POST);

function createMethod(method) {
  return async ({url = "", responseType = "json", params, data, metadata, timeout = 10000}) => {
    return axios({
      method,
      url: `${API}${url}`,
      responseType,
      ...(params && {params}),
      ...(data && {data}),
      ...(metadata && {metadata}),
      ...(isFinite(timeout) && {timeout})
    });
  };
}

