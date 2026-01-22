import {createContext, useContext} from "react";
import {useRouter} from "next/navigation";

export function CallbacksProvider({extraCallbacks = {}, children}) {
  const router = useRouter();

  const callbacks = {
    redirect(page) {
      router.push(page);
    },
    ...extraCallbacks,
  };

  return <CallbacksContext.Provider value={callbacks}>{children}</CallbacksContext.Provider>;
}

const CallbacksContext = createContext({});

export const useAppCallbacks = () => useContext(CallbacksContext);
