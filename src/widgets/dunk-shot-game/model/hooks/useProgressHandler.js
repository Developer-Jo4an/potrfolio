import {useEffect} from "react";
import {isFinite} from "lodash";
import {useDunkShotStore} from "../state-manager/dunkShotStore";
import {SET} from "@shared";

export function useProgressHandler() {
  const {setProgress, gameData: {progress: {current, max} = {}} = {}} = useDunkShotStore();

  useEffect(() => {
    if (![current, max].every(isFinite)) return;

    if (current === max) {
      const timeoutId = setTimeout(() => {
        setProgress({action: SET, data: {value: 0}});
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [current, max]);
}
