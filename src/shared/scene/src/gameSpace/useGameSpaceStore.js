import {useEffect, useState, useSyncExternalStore} from "react";
import {isObject} from "lodash";
import {ProxyGameSpaceStore} from "@shared";

export function useGameSpaceStore(store, config) {
  const [_, setInitializedProxy] = useState(false);

  useEffect(() => {
    (async () => {
      if (store instanceof ProxyGameSpaceStore) {
        await ProxyGameSpaceStore.init();
        isObject(config) && store.init(config);
        setInitializedProxy(true);
      }
    })();
  }, [store, config]);

  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}
