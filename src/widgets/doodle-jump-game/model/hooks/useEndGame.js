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
    const {score, currentTime} = gameSpace;
    const modalData = endModal({wrapper, modalNames: names, currentTime, redirect, score, status});
    add(modalData);
  }, [wrapper]);
}
