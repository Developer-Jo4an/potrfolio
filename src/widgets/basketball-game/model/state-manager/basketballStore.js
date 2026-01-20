import {createStore} from "@shared";
import {BASKETBALL} from "../../constants/game";

const {useStore: useBasketballStore, selectors} = createStore({
  name: BASKETBALL,
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

export {useBasketballStore};
