import useModalStore from "../../../../../application/providers/modal/model/state-manager/stores/modalStore";

export default function useCallModals({modalsData}) {
  const actions = useModalStore();

  return () => {
    for (const key in modalsData) {
      const modals = modalsData[key];
      const necessaryAction = actions[key];
      modals.forEach(modalProps => necessaryAction(modalProps));
    }
  };
}