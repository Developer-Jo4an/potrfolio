import {createStore} from "../../../../shared/model/state-manager/createStore";
import {BASKETBALL} from "../../constants/game";

const {useStore: useBasketballStore, selectors} = createStore({
  name: BASKETBALL,
  state: {
    wrapper: null
  },
  syncActions: {
    setWrapper({state}, wrapper) {
      state.wrapper = wrapper;
    }
  }
});

export default useBasketballStore;