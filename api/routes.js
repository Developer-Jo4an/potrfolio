import {get} from "./methods";

const cachedPromises = {};

export const getGames = () => {
  return cachedPromises["get-games"] ??= get({url: "/games", metadata: {requestKey: "get-games"}})
};