import {useRouteHandler} from "../hooks/useRouteHandler";
import useAppStore from "../stateManager/appStore";
import {useProtectPage} from "../hooks/useProtectPage";
import usePlatformerStore from "../stateManager/platformerStore";
import {useMemo} from "react";

export default function HooksProvider({children}) {
  useRouteHandler(
    useMemo(() => ({
      "/": () => {
        const {getGames} = useAppStore.getState();
        getGames();
      }
    }), [])
  );

  useProtectPage({
    "/platformer": {
      redirectTo: "/",
      checker: () => {
        const {gameSettings} = usePlatformerStore.getState();
        return !gameSettings;
      }
    }
  });

  return children;
}