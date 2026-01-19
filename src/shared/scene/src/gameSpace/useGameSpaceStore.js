import {useSyncExternalStore} from "react";

export function useGameSpaceStore(store) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}