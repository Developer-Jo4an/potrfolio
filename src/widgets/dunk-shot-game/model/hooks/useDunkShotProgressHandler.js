import {useEffect} from "react";
import useDunkShotStore from "../state-manager/dunkShotStore";
import {isFinite} from "lodash";
import {SET} from "../../../../shared/constants/actions/names";

export default function useDunkShotProgressHandler() {
  const {setDunkShotProgress, gameData: {progress: {current, max} = {}} = {}} = useDunkShotStore();

  useEffect(() => {
    if (![current, max].every(isFinite)) return;

    if (current === max) {
      const timeoutId = setTimeout(() => {
        setDunkShotProgress({action: SET, data: {value: 0}});
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [current, max]);
};