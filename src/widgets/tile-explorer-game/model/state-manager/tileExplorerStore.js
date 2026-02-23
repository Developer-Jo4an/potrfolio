import {createStore} from "@shared";
import {GAME} from "../../controllers/constants/game";

const {useStore: useTileExplorerStore, selectors} = createStore({
  name: GAME,
  state: {wrapper: null, state: null},
  syncActions: {
    setWrapper({state}, wrapper) {
      state.wrapper = wrapper;
    },
    setState({state}, newState) {
      state.state = newState;
    },
  },
});

export {useTileExplorerStore};
