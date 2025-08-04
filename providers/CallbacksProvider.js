import {createContext, useContext} from "react";

const CallbacksContext = createContext({});

export default function CallbacksProvider({children}) {
  return (
    <CallbacksContext.Provider value={{}}>
      {children}
    </CallbacksContext.Provider>
  );
}

export const useAppCallbacks = () => useContext(CallbacksContext);