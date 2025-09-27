import {createContext, useContext} from "react";
import {useRouter} from "next/navigation";

export default function CallbacksProvider({children}) {
  const router = useRouter();

  const callbacks = {
    redirect(page) {
      router.push(page)
    }
  };

  return (
    <CallbacksContext.Provider value={callbacks}>
      {children}
    </CallbacksContext.Provider>
  );
}

const CallbacksContext = createContext({});

export const useAppCallbacks = () => useContext(CallbacksContext);