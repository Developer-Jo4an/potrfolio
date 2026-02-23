import {useAppCallbacks, useModalProvider} from "@shared";
import {useDunkShotStore} from "../state-manager/dunkShotStore";
import content from "../../controllers/constants/content";

const {endModal} = content;

export function useEndGame() {
  const {wrapper} = useDunkShotStore();
  const {redirect} = useAppCallbacks();
  const {names, add} = useModalProvider();

  return ({status}) => {
    wrapper.state = status;

    const {
      gameData: {story, pureCount, score}
    } = useDunkShotStore.getState();

    const modalData = endModal({wrapper, modalNames: names, redirect, score, pureCount, status, story});

    add(modalData);
  };
}
