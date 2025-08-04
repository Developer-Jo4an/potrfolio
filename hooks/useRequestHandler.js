import {useEffect} from "react";
import axios from "axios";

export const useRequestHandler = (handlers = []) => {
  useEffect(() => {
    const requestHandler = axios.interceptors.request.use(
      config => {
        callHandlers(handlers, "onPending", {config});
        return config;
      },
      error => {
        callHandlers(handlers, "onPendingRejected", error);
        return error;
      }
    );

    const responseHandler = axios.interceptors.response.use(
      response => {
        (async () => {
          await callHandlers(handlers, "onFulfilled", response);
          await callHandlers(handlers, "onSettled", response);
        })();

        return response;
      },
      error => {
        (async () => {
          await callHandlers(handlers, "onRejected", error);
          await callHandlers(handlers, "onSettled", error);
        })();

        return error;
      }
    );

    return () => {
      axios.interceptors.request.eject(requestHandler);
      axios.interceptors.response.eject(responseHandler);
    };
  }, [handlers]);
};

function callHandlers(handlers, handlerKey, data) {
  return Promise.all(handlers.map(handlersObject => {
    const necessaryHandler = handlersObject[handlerKey];

    if (data?.config?.metadata?.requestKey === handlersObject?.request && typeof necessaryHandler === "function")
      return necessaryHandler(data);

    return Promise.resolve();
  }));
}