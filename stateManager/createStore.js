import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {FULFILLED, PENDING, REJECTED, SETTLED} from "../constants/promise/statuses";
import {upperFirst} from "lodash/string";
import {devtools} from "zustand/middleware";
import {useShallow} from "zustand/shallow";

class StateManagerStore {

  stores = {};

  constructor() {
  }

  initStore(data) {
    const {stores} = this;

    const {name, state = {}, actions = {}, asyncActions = {}, interceptors = {}, selectors = {}, matchers = {}} = data;

    let customSyncActions;
    let customAsyncActions;
    let customInterceptors;
    let customMatchers;

    const useStore = create(devtools(immer(set => {
      customSyncActions = this.createActions(actions, set);
      customAsyncActions = this.createAsyncActions(asyncActions, set);
      customInterceptors = this.createInterceptors(interceptors, set);
      customMatchers = this.createMatchers(matchers, set);

      return ({
        ...state,
        ...customSyncActions,
        ...customAsyncActions
      });
    })));

    return stores[name] = {
      useStore,
      selectors: this.createSelectors(useStore, selectors),
      syncActions: customSyncActions,
      asyncActions: customAsyncActions,
      interceptors: customInterceptors,
      matchers: customMatchers
    };
  }

  createActions(actions, set) {
    const customActions = {};

    for (const key in actions) {
      const action = actions[key];

      customActions[key] = (...data) => {
        set(state => action(state, ...data));
        this.callMatchers(key, ...data);
      };
    }

    return customActions;
  }

  createAsyncActions(asyncActions, set) {
    const customActions = {};

    for (const key in asyncActions) {
      const {request, onPending, onFulfilled, onRejected, onSettled} = asyncActions[key];

      customActions[key] = async (...data) => {
        let totalData;

        try {
          typeof onPending === "function" && set(state => onPending(state, totalData));

          this.callInterceptor(key, data, PENDING);

          totalData = await request(...data);

          typeof onFulfilled === "function" && set(state => onFulfilled(state, totalData));

          this.callInterceptor(key, totalData, FULFILLED);
        } catch (e) {
          totalData = e;

          typeof onRejected === "function" && set(state => onRejected(state, totalData));

          this.callInterceptor(key, totalData, REJECTED);
        } finally {
          typeof onSettled === "function" && set(state => onSettled(state, totalData));

          this.callInterceptor(key, totalData, SETTLED);
        }
      };
    }

    return customActions;
  }

  createInterceptors(interceptors, set) {
    const customInterceptors = {};

    for (const key in interceptors) {
      const action = interceptors[key];
      customInterceptors[key] = data => set(state => action(state, data));
    }

    return customInterceptors;
  }

  createMatchers(matchers, set) {
    const customMatchers = {};

    for (const key in matchers) {
      const {checker, handler} = matchers[key];

      customMatchers[key] = (actionKey, ...data) => {
        const isChecked = checker(actionKey, ...data);

        if (isChecked)
          set(state => handler(actionKey, state, ...data));
      };
    }

    return customMatchers;
  }

  createSelectors(useStore, selectors) {
    const customSelectors = {};

    for (const key in selectors)
      customSelectors[`use${upperFirst(key)}`] = () => useStore(useShallow(selectors[key]));

    return customSelectors;
  }

  callInterceptor(actionKey, data, status) {
    const {stores} = this;

    for (const key in stores) {
      const {interceptors} = stores[key];
      interceptors[`${actionKey}:${status}`]?.(data);
    }
  }

  callMatchers(actionKey, ...data) {
    const {stores} = this;

    for (const key in stores) {
      const {matchers} = stores[key];

      for (const subKey in matchers)
        matchers[subKey](actionKey, ...data);
    }
  }
}

const globalStore = new StateManagerStore();

export const createStore = data => globalStore.initStore(data);