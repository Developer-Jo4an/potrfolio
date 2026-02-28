import {components} from "../../constants/components";
import {useCallback} from "react";
import {isFunction} from "lodash";
import {useGetInfo} from "../../model/hooks/useGetInfo";
import {useEndGame} from "../../model/hooks/useEndGame";
import {usePause} from "../../model/hooks/usePause";
import {useSound} from "../../model/hooks/useSound";
import styles from "./GameWrapper.module.scss";

export function GameWrapper({fullProps, setFullProps, list}) {
  const updateProps = useCallback(
    (object) => {
      const isHasChanges = Object.entries(object).some(([key, value]) => {
        return value !== fullProps[key];
      });

      if (isHasChanges)
        setFullProps((prev) => {
          const newState = {...prev};
          for (const key in object) newState[key] = object[key];
          return newState;
        });
    },
    [fullProps],
  );

  const pause = usePause(fullProps);
  const sound = useSound(fullProps);

  useGetInfo(fullProps);
  useEndGame(fullProps);

  return (
    <div className={styles.gameWrapper}>
      {list.map(({Component, type, props = {}}, index) => {
        const TotalComponent = Component ?? components[type];
        const truthProps = isFunction(props) ? props(fullProps) : {...fullProps, ...props};
        const totalProps = {...truthProps, pause, sound};
        return <TotalComponent key={index} {...totalProps} updateProps={updateProps} />;
      })}
    </div>
  );
}
