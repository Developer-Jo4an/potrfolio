import {SUCCESS, get} from "@shared";
import {GET_GAME_LIST} from "../constants/requests";

const cashedRequests = {};

export async function getGameList() {
  if (cashedRequests[GET_GAME_LIST]) return cashedRequests[GET_GAME_LIST];
  const response = await get({url: "/games/list.json", metadata: {requestKey: GET_GAME_LIST}});

  if (response.status === SUCCESS) cashedRequests[GET_GAME_LIST] = response;

  return response;
}
