import {createContext, useContext} from "react";
import {redirect, useRouter} from "next/navigation";

const CallbacksContext = createContext({});

export default function CallbacksProvider({children}) {
  const router = useRouter();

  const callbacks = {
    requestPage(page) {
      router.push(page);
    },
    redirectPage(page) {
      redirect(page)
    }
  };

  return (
    <CallbacksContext.Provider value={callbacks}>
      {children}
    </CallbacksContext.Provider>
  );
}

export const useAppCallbacks = () => useContext(CallbacksContext);