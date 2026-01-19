import {createContext, useContext, useEffect} from "react";
import {usePathname} from "next/navigation";

export function ApiProvider({children}) {
  const pathname = usePathname();

  useEffect(() => {
    //TODO: есть ли какие-то запросы при изменении pathname?
  }, [pathname]);

  return (
    <ApiContext.Provider value={{}}>
      {children}
    </ApiContext.Provider>
  );
}

const ApiContext = createContext({});

export const useApiProvider = () => useContext(ApiContext);