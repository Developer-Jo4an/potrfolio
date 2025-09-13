import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {devtools} from "zustand/middleware";
import {useShallow} from "zustand/shallow";
import {FULFILLED, PENDING, REJECTED, SETTLED} from "../../constants/promise/statuses";
import {upperFirst} from "lodash/string";
import {isFunction, isObject} from "lodash";
import {SUCCESS} from "../../constants/api/statuses";

class StateManagerStore {

  stores = {};

  constructor() {
    this.setContext = this.setContext.bind(this);
  }

  initStore(data) {
    const {stores} = this;

    const {name, state = {}, actions = {}, asyncActions = {}, interceptors = {}, selectors = {}, matchers = {}} = data;

    let customSyncActions;
    let customAsyncActions;
    let customInterceptors;
    let customMatchers;

    const useStore = create(devtools(immer(set => {
      customSyncActions = this.setContext(this.createActions(actions, set));
      customAsyncActions = this.setContext(this.createAsyncActions(asyncActions, set));
      customInterceptors = this.setContext(this.createInterceptors(interceptors, set));
      customMatchers = this.setContext(this.createMatchers(matchers, set));

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

    const self = this;

    for (const key in actions) {
      const action = actions[key];

      customActions[key] = function (...data) {
        let result;
        set(state => result = action(state, ...data));
        self.callMatchers(key, ...data);
        return result;
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
          isFunction(onPending) && set(state => onPending.call(self, state, totalData));

          self.callInterceptor(key, data, PENDING);

          totalData = await request(...data);

          isFunction(onFulfilled) && set(state => onFulfilled.call(self, state, totalData));

          self.callInterceptor(key, totalData, FULFILLED);
        } catch (e) {
          totalData = e;

          isFunction(onRejected) && set(state => onRejected.call(self, state, totalData));

          self.callInterceptor(key, totalData, REJECTED);
        } finally {
          isFunction(onSettled) && set(state => onSettled.call(self, state, totalData));

          self.callInterceptor(key, totalData, SETTLED);
        }

        return totalData;
      };
    }

    return customActions;
  }

  createInterceptors(interceptors, set) {
    const customInterceptors = {};

    for (const key in interceptors) {
      const action = interceptors[key];

      customInterceptors[key] = function (data) {
        set(state => action(state, data));
      };
    }

    return customInterceptors;
  }

  createMatchers(matchers, set) {
    const customMatchers = {};

    for (const key in matchers) {
      const {checker, handler} = matchers[key];

      customMatchers[key] = function (actionKey, ...data) {
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

  setContext(callbacks) {
    const callbacksWithContext = {};

    for (const key in callbacks)
      callbacksWithContext[key] = callbacks[key].bind(this);

    return callbacksWithContext;
  }

  getStoreByName(name) {
    const {stores} = this;

    return stores[name]?.useStore;
  }
}

const globalStore = new StateManagerStore();

export const createStore = data => globalStore.initStore(data);