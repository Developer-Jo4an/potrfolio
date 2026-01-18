import {useSyncExternalStore} from "react";

export default function useGameSpaceStore(store) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}