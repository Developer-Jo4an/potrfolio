import {createStore} from "../../../../shared/model/state-manager/createStore";
import {getGameList} from "../../api/requests";

const {useStore: useGamesStore, selectors} = createStore({
  name: "games",
  state: {
    gameList: []
  },
  actions: {},
  asyncActions: {
    getGameList: {
      request: getGameList,
      onFulfilled(state, {data}) {
        state.gameList = data;
      }
    }
  }
});

export default useGamesStore;