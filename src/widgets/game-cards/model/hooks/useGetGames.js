import {useGamesStore} from "../state-manager/gamesStore";
import {useEffect} from "react";

export function useGetGames() {
  const {getGameList} = useGamesStore();

  useEffect(() => {
    getGameList();
  }, []);
}