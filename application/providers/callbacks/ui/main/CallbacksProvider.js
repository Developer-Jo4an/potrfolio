import {createContext, useContext} from "react";

const CallbacksContext = createContext({});

export default function CallbacksProvider({children}) {
  const callbacks = {

  };

  return (
    <CallbacksContext.Provider value={callbacks}>
      {children}
    </CallbacksContext.Provider>
  );
}

export const useAppCallbacks = () => useContext(CallbacksContext);