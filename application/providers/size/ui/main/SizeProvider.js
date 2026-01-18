import {createContext, useContext, useLayoutEffect, useState} from "react";
import eventSubscription from "../../../../../shared/lib/events/eventListener";
import {createDeviceName, LANDSCAPE, MOBILE, onResize} from "../../config/adaptive-settings";
import {RESIZE} from "../../../../../shared/constants/events/eventsNames";
import styles from "./SizeProvider.module.scss";

const SizeContext = createContext({});

export default function SizeProvider({children}) {
  const [{width, height}, setSize] = useState({});
  const [isVisibleBlock, setIsVisibleBlock] = useState(false);

  useLayoutEffect(() => {
    const resizeHandler = () => {
      const {innerWidth: width, innerHeight: height} = global;
      setSize({width, height});
      const {device} = onResize();
      setIsVisibleBlock(createDeviceName(MOBILE, LANDSCAPE) === device);
    };

    resizeHandler();

    return eventSubscription({callbacksBus: [{event: RESIZE, callback: resizeHandler}]});
  }, []);

  return (
    <SizeContext.Provider value={{width, height}}>
      {children}
      {isVisibleBlock && <div className={styles.blocker}/>}
    </SizeContext.Provider>
  );
}

export const useWindowSize = () => useContext(SizeContext);