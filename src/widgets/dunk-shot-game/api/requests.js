import {get} from "@shared";
import {GET_GAME_CONFIG} from "../constants/requests";

export function getGameConfig() {
  return get({url: "/games/dunk-shot/config.json", metadata: {requestKey: GET_GAME_CONFIG}});
}
