import {createStore} from "../../../../shared/model/state-manager/createStore";
import {getDefaultStats} from "../../constants/defaultStats";
import {getGameConfig} from "../../api/requests";

const {useStore: useDunkShotStore, selectors} = createStore({
  name: "dunkShot",
  state: {
    wrapper: null,
    gameData: null,
    config: null
  },
  syncActions: {
    setWrapper({state}, wrapper) {
      state.wrapper = wrapper;
    }
  },
  asyncActions: {
    getGameConfig: {
      request: getGameConfig,
      onFulfilled({state}, {data: config}) {
        state.config = config;
        state.gameData = getDefaultStats();
      }
    }
  },
  interceptors: {},
  selectors: {},
  helpers: {}
});

export default useDunkShotStore;
