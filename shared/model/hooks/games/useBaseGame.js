import {useRef, useState} from "react";
import useResetGame from "./useResetGame";
import useStateReducer from "../../../utils/scene/react/hooks/useStateReducer";
import {getNextState} from "../../../utils/state/state";
import {ignoreNextStates, states} from "../../../constants/games/core/states";

export function useBaseGame({
                              reducers = {},
                            } = {}) {
  const [wrapper, setWrapper] = useState();
  const [state, setState] = useState("loadManifest");
  const containerRef = useRef();


  useStateReducer(reducers, ignoreNextStates, state => setState(getNextState(states, state)), state, wrapper);
  useResetGame({wrapper});

  return {
    containerRef,
    wrapper,
    setWrapper,
    state,
    setState,
  };
}
