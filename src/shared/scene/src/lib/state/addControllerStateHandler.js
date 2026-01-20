import {isFunction, upperFirst} from "lodash";

export const addControllerStateHandler = (context, stateMachine) => {
  return new Proxy(context, {
    get(target, prop, receiver) {
      const originalFunction = target[prop];

      const isMethodOnStateChange = Object.keys(stateMachine).some((stateKey) => {
        const stateMethodKey = `${stateKey}Select`;
        return stateMethodKey === prop;
      });

      if (!isMethodOnStateChange) return Reflect.get(target, prop, receiver);

      return async function (...args) {
        const beforeFunction = target[`before${upperFirst(prop)}`];

        if (isFunction(beforeFunction)) await beforeFunction.call(target);

        if (isFunction(originalFunction)) await originalFunction.call(target, ...args);

        const {controllers} = target;

        return Promise.all(
          controllers.map((controller) => {
            const necessaryStateFunction = controller[prop];

            return isFunction(necessaryStateFunction) ? necessaryStateFunction.call(controller) : Promise.resolve();
          }),
        );
      };
    },
  });
};
