import {createStore} from "@shared";
import {CAR} from "../../constants/game";

const {useStore: useCarStore, selectors} = createStore({
  name: CAR,
  state: {
    wrapper: null
  },
  syncActions: {
    setWrapper({state}, wrapper) {
      state.wrapper = wrapper;
    }
  }
});

export {useCarStore};