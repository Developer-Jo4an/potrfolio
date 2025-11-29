import {createStore} from "../../../../shared/model/state-manager/createStore";
import {CAR} from "../../constants/game";

const {useStore: useCarStore, selectors} = createStore({
  name: CAR,
  state: {
    wrapper: null,
    gameData: {}
  },
  syncActions: {
    setWrapper({state}, wrapper) {
      state.wrapper = wrapper;
    },
    setState({state, newState}) {
      const {gameData} = state;
      gameData.state = newState;
    }
  }
});

export default useCarStore;