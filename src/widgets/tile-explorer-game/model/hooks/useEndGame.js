import {useCallback} from "react";
import {useAppCallbacks, useModalProvider} from "@shared";
import content from "../../constants/content";
import {useTileExplorerStore} from "../state-manager/tileExplorerStore";

const {endModal} = content;

export function useEndGame({gameSpace}) {
  const {wrapper} = useTileExplorerStore();
  const {redirect} = useAppCallbacks();
  const {names, add} = useModalProvider();

  return useCallback(({status}) => {
    const {score, currentTime} = gameSpace;
    const modalData = endModal({wrapper, modalNames: names, currentTime, redirect, score, status});
    add(modalData);
  }, [wrapper]);
}
