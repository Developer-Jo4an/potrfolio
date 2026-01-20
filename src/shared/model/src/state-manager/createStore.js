import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {subscribeWithSelector} from "zustand/middleware";
import {useShallow} from "zustand/shallow";
import {isFunction, isObject, upperFirst} from "lodash";
import {FULFILLED, PENDING, REJECTED, SETTLED} from "../../../constants";

class StateManagerStore {
  stores = {};

  constructor() {}

  initStore(data) {
    const {stores} = this;

    const {
      name,
      state = {},
      syncActions = {},
      asyncActions = {},
      interceptors = {},
      selectors = {},
      matchers = {},
      helpers = {},
    } = data;

    let customSyncActions;
    let customAsyncActions;
    let customInterceptors;
    let customMatchers;

    const useStore = create(
      immer(
        subscribeWithSelector((set) => {
          customSyncActions = this.createSyncActions(syncActions, set);
          customAsyncActions = this.createAsyncActions(asyncActions, set);
          customInterceptors = this.createInterceptors(interceptors, set);
          customMatchers = this.createMatchers(matchers, set);

          return {...state, ...customSyncActions, ...customAsyncActions};
        }),
      ),
    );

    return (stores[name] = {
      useStore,
      selectors: this.createSelectors(useStore, selectors),
      originSyncActions: syncActions,
      syncActions: customSyncActions,
      asyncActions: customAsyncActions,
      interceptors: customInterceptors,
      matchers: customMatchers,
      helpers,
    });
  }

  createSyncActions(actions, set) {
    const customActions = {};

    const self = this;

    for (const key in actions) {
      const action = actions[key];

      customActions[key] = function (...data) {
        const returned = {};
        set((state) => {
          action({state, globalStore: self, returned}, ...data);
          self.callMatchers(key, state, ...data);
        });
        return returned;
      };
    }

    return customActions;
  }

  createAsyncActions(asyncActions, set) {
    const customActions = {};

    const self = this;

    for (const key in asyncActions) {
      const asyncActionData = asyncActions[key];

      if (!isObject(asyncActionData)) {
        console.warn("asyncActionData is not a object", asyncActionData);
        continue;
      }

      const {request, onPending, onFulfilled, onRejected, onSettled} = asyncActionData;

      if (!isFunction(request)) {
        console.warn("request is not a function", request);
        continue;
      }

      customActions[key] = async function (...data) {
        let totalData;

        try {
          isFunction(onPending) &&
            set((state) => {
              onPending.call(self, {state, globalStore: self}, totalData);
              self.callInterceptor(key, state, data, PENDING);
            });

          totalData = await request(...data);

          isFunction(onFulfilled) &&
            set((state) => {
              onFulfilled.call(self, {state, globalStore: self}, totalData);
              self.callInterceptor(key, state, totalData, FULFILLED);
            });
        } catch (e) {
          totalData = e;

          isFunction(onRejected) &&
            set((state) => {
              onRejected.call(self, {state, globalStore: self}, totalData);
              self.callInterceptor(key, state, totalData, REJECTED);
            });
        } finally {
          isFunction(onSettled) &&
            set((state) => {
              onSettled.call(self, {state, globalStore: self}, totalData);
              self.callInterceptor(key, state, totalData, SETTLED);
            });
        }

        return totalData;
      };
    }

    return customActions;
  }

  createInterceptors(interceptors, set) {
    const customInterceptors = {};

    const self = this;

    for (const key in interceptors) {
      const action = interceptors[key];

      customInterceptors[key] = function (data) {
        set((state) => action({state, globalStore: self}, data));
      };
    }

    return customInterceptors;
  }

  createMatchers(matchers, set) {
    const customMatchers = {};

    const self = this;

    for (const key in matchers) {
      const {checker, handler} = matchers[key];

      customMatchers[key] = function (actionKey, ...data) {
        const isChecked = checker(actionKey, ...data);

        if (isChecked) set((state) => handler(actionKey, {state, globalStore: self}, ...data));
      };
    }

    return customMatchers;
  }

  createSelectors(useStore, selectors) {
    const customSelectors = {};

    for (const key in selectors) customSelectors[`use${upperFirst(key)}`] = () => useStore(useShallow(selectors[key]));

    return customSelectors;
  }

  callInterceptor(actionKey, state, data, status) {
    const {stores} = this;

    const self = this;

    for (const key in stores) {
      const {interceptors} = stores[key];
      interceptors[`${actionKey}:${status}`]?.({state, globalState: self}, data);
    }
  }

  callMatchers(actionKey, state, ...data) {
    const {stores} = this;

    const self = this;

    for (const key in stores) {
      const {matchers} = stores[key];

      for (const subKey in matchers) matchers[subKey](actionKey, {state, globalState: self}, ...data);
    }
  }

  getStoreByName(name) {
    const {stores} = this;

    return stores[name];
  }
}

const globalStore = new StateManagerStore();

export const createStore = (data) => globalStore.initStore(data);
