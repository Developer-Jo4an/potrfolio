import {useDunkShotStore} from "../state-manager/dunkShotStore";

export function useActiveBoosters() {
  const {gameData: {boosters}} = useDunkShotStore();

  return boosters?.reduce((acc, {isActive, name}) => {
    acc[name] = isActive;
    return acc;
  }, {});
}