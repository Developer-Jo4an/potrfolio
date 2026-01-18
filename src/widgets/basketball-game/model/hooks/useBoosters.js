import useBasketballStore from "../state-manager/basketballStore";
import gameSpaceStore from "../storages/gameSpace";

export default function useBoosters() {
  const {wrapper} = useBasketballStore();

  return function (type) {
    wrapper.activateBooster(type);
    const {set} = gameSpaceStore;
    set(({booster}) => {
      booster[type]--;
    });
  };
}