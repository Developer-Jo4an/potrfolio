import {useEffect, useState} from "react";
import {isFunction} from "lodash";
import axios from "axios";
import {PENDING, REJECTED, FULFILLED} from "../../../constants";

export function useRequestsHandler(handlers) {
  const [requestStatuses, setRequestStatuses] = useState({});

  const pendingData = (() => {
    let isPendingSome = false;
    let isPendingSpecifiedHandlers = false;

    for (const key in requestStatuses) {
      const status = requestStatuses[key];

      if (status === PENDING) {
        isPendingSome = true;
        if (handlers.some(({request}) => request === key))
          isPendingSpecifiedHandlers = true;
      }
    }

    return {isPendingSome, isPendingSpecifiedHandlers};
  })();

  useEffect(() => {
    const requestHandler = axios.interceptors.request.use(
      config => {
        const {metadata: {requestKey} = {}} = config;

        callHandlers(handlers, "onPending", {config});

        setStatus(setRequestStatuses, requestKey, PENDING);

        return config;
      },
      error => {
        const {config: {metadata: {requestKey} = {}}} = error;

        callHandlers(handlers, "onPendingRejected", error);

        setStatus(setRequestStatuses, requestKey, REJECTED);

        return Promise.reject(error);
      }
    );

    const responseHandler = axios.interceptors.response.use(
      response => {
        const {config: {metadata: {requestKey} = {}}} = response;

        (async () => {
          await callHandlers(handlers, "onFulfilled", response);
          await callHandlers(handlers, "onSettled", response);
        })();

        setStatus(setRequestStatuses, requestKey, FULFILLED);

        return response;
      },
      error => {
        const {config: {metadata: {requestKey} = {}}} = error;

        (async () => {
          await callHandlers(handlers, "onRejected", error);
          await callHandlers(handlers, "onSettled", error);
        })();

        setStatus(setRequestStatuses, requestKey, REJECTED);

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestHandler);
      axios.interceptors.response.eject(responseHandler);
    };
  }, [handlers]);

  return pendingData;
}

function setStatus(setter, requestKey, status) {
  if (requestKey)
    setter(prev => ({...prev, [requestKey]: status}));
}

function callHandlers(handlers, handlerKey, data) {
  return Promise.all(handlers.map(handlersObject => {
    const necessaryHandler = handlersObject[handlerKey];

    if (data?.config?.metadata?.requestKey === handlersObject?.request && isFunction(necessaryHandler))
      return necessaryHandler(data);

    return Promise.resolve();
  }));
}