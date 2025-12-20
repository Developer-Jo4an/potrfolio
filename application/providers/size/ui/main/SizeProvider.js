import {createContext, useContext, useLayoutEffect, useState} from "react";
import eventSubscription from "../../../../../shared/lib/events/eventListener";

const SizeContext = createContext({});

export default function SizeProvider({children}) {
  const [{width, height}, setSize] = useState({});

  useLayoutEffect(() => {
    const resizeHandler = () => {
      const {innerWidth: width, innerHeight: height} = global;
      setSize({width, height});
    };

    resizeHandler();

    return eventSubscription({callbacksBus: [{event: "resize", callback: resizeHandler}]});
  }, []);

  return (
    <SizeContext.Provider value={{width, height}}>
      {children}
    </SizeContext.Provider>
  );
}

export const useWindowSize = () => useContext(SizeContext);