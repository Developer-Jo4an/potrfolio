import {useTileExplorerStore} from "../state-manager/tileExplorerStore";

export function useBoosters() {
  const {wrapper} = useTileExplorerStore();

  return {
    onClick: (type) => {
      wrapper?.applyBooster?.(type);
    },
  };
}
