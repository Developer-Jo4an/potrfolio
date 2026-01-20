import {useEffect} from "react";
import {useGamesStore} from "../state-manager/gamesStore";

export function useReset() {
  const {reset} = useGamesStore();
  useEffect(() => reset, []);
}
