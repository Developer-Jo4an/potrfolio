import {createStore} from "@shared";
import {CAR} from "../../controllers/constants/game";

const {useStore: useCarStore, selectors} = createStore({
  name: CAR,
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

export {useCarStore};
