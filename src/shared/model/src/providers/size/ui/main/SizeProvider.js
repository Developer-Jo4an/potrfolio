import {createContext, useContext, useLayoutEffect, useState} from "react";
import {eventSubscription, RESIZE} from "../../../../../../index";
import {createDeviceName, LANDSCAPE, MOBILE, onResize} from "../../config/adaptive-settings";
import styles from "./SizeProvider.module.scss";

const SizeContext = createContext({});

export function SizeProvider({onResize: afterResize, children}) {
  const [{width, height}, setSize] = useState({});
  const [isVisibleBlock, setIsVisibleBlock] = useState(false);

  useLayoutEffect(() => {
    const resizeHandler = () => {
      const {innerWidth: width, innerHeight: height} = global;
      setSize({width, height});
      const {device} = onResize();
      setIsVisibleBlock(createDeviceName(MOBILE, LANDSCAPE) === device);
      afterResize?.(width, height);
    };

    resizeHandler();

    return eventSubscription({callbacksBus: [{event: RESIZE, callback: resizeHandler}]});
  }, [afterResize]);

  return (
    <SizeContext.Provider value={{width, height}}>
      {children}
      {isVisibleBlock && <div className={styles.blocker} />}
    </SizeContext.Provider>
  );
}

export const useWindowSize = () => useContext(SizeContext);
