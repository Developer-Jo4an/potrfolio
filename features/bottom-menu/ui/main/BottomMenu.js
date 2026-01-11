import {Button} from "../../../../shared/ui/button";
import {Image} from "../../../../shared/ui/image";
import {isFinite} from "lodash";
import cl from "classnames";
import styles from "./BottomMenu.module.scss";

export default function BottomMenu({buttons, children}) {
  return (
    <div className={styles.bottomMenu}>
      {buttons?.map((
        {
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
          {img && <Image {...img}/>}
          {Icon && <Icon/>}
          {isFinite(value) && <div className={styles.buttonCount}>{value}</div>}
        </Button>
      ))}
      {children}
    </div>
  );
}