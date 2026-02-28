import {useCallback} from "react";
import {useAppCallbacks, useModalProvider} from "@shared";
import {useTileExplorerStore} from "../state-manager/tileExplorerStore";
import content from "../../constants/content";

const {endModal} = content;
//TODO: посмотреть, как проигрываются игры

export function useEndGame({gameSpace}) {
  const {wrapper} = useTileExplorerStore();
  const {redirect} = useAppCallbacks();
  const {names, add} = useModalProvider();

  return useCallback(
    ({status}) => {
      wrapper.state = status;
      const {score, currentTime} = gameSpace;
      const modalData = endModal({wrapper, modalNames: names, currentTime, redirect, score, status});
      add(modalData);
    },
    [wrapper, gameSpace],
  );
}
