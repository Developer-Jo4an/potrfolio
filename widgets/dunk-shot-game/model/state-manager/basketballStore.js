import {createStore} from "../../../../shared/model/state-manager/createStore";

const {useStore: useDunkShotStore, selectors} = createStore({
  name: "dunkShot",
  state: {
    wrapper: null
  },
  syncActions: {

  },
  asyncActions: {},
  interceptors: {},
  selectors: {},
  helpers: {}
});

export default useDunkShotStore;
