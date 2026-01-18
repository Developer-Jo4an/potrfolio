import {useImperativeHandle, useRef} from "react";
import {Button} from "../../../../shared/ui/button";
import {Image} from "../../../../shared/ui/image";
import {isFinite} from "lodash";
import cl from "classnames";
import styles from "./BottomMenu.module.scss";

export default function BottomMenu({className, buttons, children, mod, ref}) {
  const {current: elements} = useRef({});

  useImperativeHandle(ref, () => elements);

  return (
    <div className={cl(styles.bottomMenu, className)} data-mod={mod}>
      {buttons?.map((
        {
          id,
          className,
          timeout,
          isDisposable,
          onClick,
          value,
          isActive,
          isDisabled,
          Icon,
          img,
          child
        }, index) => (
        <Button
          key={index}
          ref={ref => elements[id ?? index] = ref}
          className={cl(
            styles.button,
            className,
            {
              [styles.buttonActive]: isActive,
              [styles.buttonInactive]: isDisabled
            }
          )}
          events={{onClick}}
          timeout={timeout}
          isDisposable={isDisposable}
        >
          {child && child}
          {img && <Image {...img} data-image={"menuImage"}/>}
          {Icon && <Icon data-icon={"menuImage"}/>}
          {isFinite(value) && <div className={styles.buttonCount}>{value}</div>}
        </Button>
      ))}
      {children}
    </div>
  );
}