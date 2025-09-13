import {createContext, useContext} from "react";


export default function CallbacksProvider({children}) {
  const callbacks = {

  };

  return (
    <CallbacksContext.Provider value={callbacks}>
      {children}
    </CallbacksContext.Provider>
  );
}

const CallbacksContext = createContext({});

export const useAppCallbacks = () => useContext(CallbacksContext);