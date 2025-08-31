import {get} from "./methods";

const cachedPromises = {};

export const getGames = () => {
  return cachedPromises["get-games"] ??= get({url: "/games/list.json", metadata: {requestKey: "get-games"}});
};

export const getPlatformerSettings = () => {
  return get({url: "/games/platformer/game-settings.json", metadata: {requestKey: "get-platformer-settings"}});
};