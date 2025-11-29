import {isArray} from "lodash";

export const STANDARD_MODE = {
  postfix: "EventListener",
  actionAdd: "add",
  actionRemove: "remove"
};

export const ON_OFF_MODE = {
  postfix: "",
  actionAdd: "on",
  actionRemove: "off"
};

export default function eventSubscription(
  {
    target = window,
    callbacksBus = [],
    postfix = STANDARD_MODE.postfix,
    actionAdd = STANDARD_MODE.actionAdd,
    actionRemove = STANDARD_MODE.actionRemove
  }) {
  const listenerLogic = action => {
    callbacksBus.forEach(({event, callback, options, target: localTarget}) => {
      if (!event) return;

      const totalTarget = localTarget ?? target;
      const eventsArray = isArray(event) ? event : [event];
      const targetsArray = isArray(totalTarget) ? totalTarget : [totalTarget];

      eventsArray.forEach(event => {
        targetsArray.forEach(target => {
          target?.[`${action}${postfix}`]?.(event, callback, options);
        });
      });
    });
  };

  listenerLogic(actionAdd);

  return () => listenerLogic(actionRemove);
}
