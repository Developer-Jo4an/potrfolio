import useBasketballStore from "../state-manager/basketballStore";

export default function useBoosters() {
  const {wrapper} = useBasketballStore();

  return function () {
    wrapper.activateBooster(...arguments);
  };
}