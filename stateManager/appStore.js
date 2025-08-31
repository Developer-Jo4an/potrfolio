import {createStore} from "./createStore";
import {getGames} from "../api/routes";

const {useStore: useAppStore, selectors} = createStore({
  name: "app",
  state: {
    games: []
  },
  actions: {},
  asyncActions: {
    getGames: {
      request: getGames,
      onFulfilled(state, {data: games}) {
        state.games = games;
      }
    }
  },
  interceptors: {},
  selectors: {
    games: ({games, getGames}) => ({games, getGames})
  }
});

export default useAppStore;

export const {useGames} = selectors;
