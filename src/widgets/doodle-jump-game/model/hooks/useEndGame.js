import {useCallback} from "react";
import {useAppCallbacks, useModalProvider} from "@shared";
import {useDoodleJumpStore} from "../state-manager/doodleJumpStore";
import content from "../../constants/content";

const {endModal} = content;

export function useEndGame({gameSpace}) {
  const {wrapper} = useDoodleJumpStore();
  const {redirect} = useAppCallbacks();
  const {names, add} = useModalProvider();

  return useCallback(({status}) => {
    wrapper.state = status;
    const modalData = endModal({wrapper, redirect, status, modalNames: names, distance: gameSpace?.score});
    add(modalData);
  }, [wrapper, gameSpace]);
}
