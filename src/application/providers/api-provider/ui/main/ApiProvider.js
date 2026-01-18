import {createContext, useContext, useEffect} from "react";
import {usePathname} from "next/navigation";
import {INDEX} from "../../../../../shared/constants/src/pages/routes";
import useGamesStore from "../../../../../widgets/game-cards/model/state-manager/gamesStore";

export default function ApiProvider({children}) {
  const pathname = usePathname();

  useEffect(() => {
    ({
      [INDEX]() {
        const {getGameList} = useGamesStore.getState();
        getGameList()
      }
    })[pathname]?.();
  }, [pathname]);

  return (
    <ApiContext.Provider value={{}}>
      {children}
    </ApiContext.Provider>
  );
}

const ApiContext = createContext({});

export const useApiProvider = () => useContext(ApiContext);