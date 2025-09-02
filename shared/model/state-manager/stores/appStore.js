import {createStore} from "../createStore";

const {useStore: useAppStore, selectors} = createStore({
  name: "app",
  state: {},
  actions: {},
  asyncActions: {},
  interceptors: {},
  selectors: {}
});

export default useAppStore;
