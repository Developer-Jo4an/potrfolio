import {createStore} from "@shared";
import {TILE_EXPLORER} from "../../constants/game";

const {useStore: useTileExplorerStore, selectors} = createStore({
  name: TILE_EXPLORER,
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
