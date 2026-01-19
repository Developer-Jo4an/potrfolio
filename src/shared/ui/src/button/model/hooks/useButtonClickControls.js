import {useCheckDisposable} from "./useCheckDisposable";
import {useCheckTimeout} from "./useCheckTimeout";
import {useCallEventFunctions} from "./useCallEventFunctions";
import {useCallCallbacks} from "./useCallCallbacks";
import {useCallModals} from "./useCallModals";
import {isFunction} from "lodash";

export function useButtonClickControls(
  {
    onClick: click,
    timeout,
    isDisposable,
    eventFunctions,
    callbacksData,
    modalsData
  }) {
  const checkDisposable = useCheckDisposable({isDisposable});
  const checkTimeout = useCheckTimeout({timeout});
  const callEventFunctions = useCallEventFunctions({eventFunctions});
  const callCallbacks = useCallCallbacks({callbacksData});
  const callModals = useCallModals({modalsData});

  return e => {
    if (!checkDisposable() || !checkTimeout()) return;
    callEventFunctions(e);
    callCallbacks();
    callModals();
    isFunction(click) && click(e);
  };
}