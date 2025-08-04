import axios from "axios";
import {GET, POST} from "../constants/api/methods";

export const API = process.env.API ?? "/api/v1";

export const get = createMethod(GET);
export const post = createMethod(POST);

function createMethod(method) {
  return async ({url, responseType = "json", params, data, metadata, timeout}) => {
    return axios({
      method: method,
      url: `${API}${url}`,
      responseType,
      ...(params ? {params} : {}),
      ...(data ? {data} : {}),
      ...(metadata ? {metadata} : {}),
      ...(typeof timeout === "number" ? {timeout} : {})
    });
  };
}