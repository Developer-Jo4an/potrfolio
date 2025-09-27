import useCheckDisposable from "./useCheckDisposable";
import useCheckTimeout from "./useCheckTimeout";
import useCallEventFunctions from "./useCallEventFunctions";
import useCallCallbacks from "./useCallCallbacks";
import {isFunction} from "lodash";

export default function useButtonClickControls(
  {
    onClick: click,
    timeout,
    isDisposable,
    eventFunctions,
    callbacksData
  }) {
  const checkDisposable = useCheckDisposable({isDisposable});
  const checkTimeout = useCheckTimeout({timeout});
  const callEventFunctions = useCallEventFunctions({eventFunctions});
  const callCallbacks = useCallCallbacks({callbacksData});

  const onClick = e => {
    if (!checkDisposable() || !checkTimeout()) return;
    callEventFunctions(e);
    callCallbacks();
    isFunction(click) && click(e);
  };

  return {onClick};
}