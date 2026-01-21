import {getTruthClasses} from "@shared";
import {useButtonClickControls} from "../../model/hooks/useButtonClickControls";
import styles from "./Button.module.scss";

export function Button({
  ref,
  className,
  style = {},
  isDisabled: disabled = false,
  isDisposable = false,
  timeout = 300,
  events = {},
  eventFunctions = [],
  callbacksData = {},
  modalsData = {},
  attrs = {},
  children,
}) {
  const {onClick: click, otherEvents = {}} = events;

  const onClick = useButtonClickControls({
    onClick: click,
    timeout,
    isDisposable,
    eventFunctions,
    callbacksData,
    modalsData,
  });

  return (
    <button
      {...attrs}
      ref={ref}
      style={style}
      className={getTruthClasses(styles.button, className)}
      onClick={onClick}
      disabled={disabled}
      {...otherEvents}>
      {children}
    </button>
  );
}
