import {useModalProvider} from "../../../../../model";

export function useCallModals({modalsData}) {
  //TODO: вынести бизнесс логику
  const actions = useModalProvider();

  return () => {
    for (const key in modalsData) {
      const modals = modalsData[key];
      const necessaryAction = actions[key];
      modals.forEach((modalProps) => necessaryAction(modalProps));
    }
  };
}
