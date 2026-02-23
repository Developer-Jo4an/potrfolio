import {useCallback} from "react";
import {useAppCallbacks, useModalProvider} from "@shared";
import content from "../../constants/content";
import {useCarStore} from "../state-machine/carStore";

const {endModal} = content;

export function useEndGame({gameSpace}) {
  const {wrapper} = useCarStore();
  const {redirect} = useAppCallbacks();
  const {names, add} = useModalProvider();

  return useCallback(({status}) => {
    wrapper.state = status;
    const {score, currentTime} = gameSpace;
    const modalData = endModal({wrapper, modalNames: names, currentTime, redirect, score, status});
    add(modalData);
  }, [wrapper]);
}
