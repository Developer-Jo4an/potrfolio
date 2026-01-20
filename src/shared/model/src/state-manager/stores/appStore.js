import {createStore} from "../createStore";

const {useStore: useAppStore, selectors} = createStore({
  name: "app",
  state: {},
  syncActions: {},
  asyncActions: {},
  interceptors: {},
  selectors: {},
  helpers: {},
});

export {useAppStore};
