import {createStore} from "@shared";
import {GAME} from "../../constants/game";

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
