import {createStore} from "./createStore";
import {getPlatformerSettings} from "../api/routes";

const getDefaultGameData = () => ({
  jumps: 0,
  hp: 100,
  damage: 1
});

const {useStore: usePlatformerStore, selectors} = createStore({
  name: "platformer",
  state: {
    gameData: getDefaultGameData(),
    gameSettings: null
  },
  actions: {},
  asyncActions: {
    getGameSettings: {
      request: getPlatformerSettings,
      onFulfilled(state, {data}) {
        state.gameSettings = data;
      }
    }
  },
  interceptors: {}
});

export default usePlatformerStore;