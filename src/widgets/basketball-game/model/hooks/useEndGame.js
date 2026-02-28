import {useCallback} from "react";
import {useAppCallbacks, useModalProvider} from "@shared";
import {useBasketballStore} from "../state-manager/basketballStore";
import {gameSpaceStore} from "../storages/gameSpace";
import content from "../../constants/content";

const {endModal} = content;

export function useEndGame() {
  const {wrapper} = useBasketballStore();
  const {redirect} = useAppCallbacks();
  const {names, add} = useModalProvider();

  return useCallback(
    ({status}) => {
      wrapper.state = status;
      const {
        gameData: {story, pureCount, score},
      } = gameSpaceStore.gameSpace;
      const modalData = endModal({wrapper, modalNames: names, redirect, score, pureCount, status, story});
      add(modalData);
    },
    [wrapper],
  );
}
