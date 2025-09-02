export const eventSubscription = (
  {
    target = window,
    callbacksBus = [],
    add = "add",
    remove = "remove",
    postfix = "EventListener"
  }) => {

  const clearFunctions = callbacksBus.map(({event, callback, options = {}, target: localTarget}) => {
    const totalTarget = localTarget ?? target;

    totalTarget?.[`${add}${postfix}`]?.(event, callback, options);

    return () => totalTarget?.[`${remove}${postfix}`]?.(event, callback, options);
  });

  return () => clearFunctions.forEach(clear => clear());
};