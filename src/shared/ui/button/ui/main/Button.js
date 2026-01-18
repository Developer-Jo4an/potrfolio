import styles from "./Button.module.scss";
import getTruthClasses from "../../../../lib/classes/getTruthClasses";
import useButtonClickControls from "../../model/hooks/useButtonClickControls";

export default function Button(
  {
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
    children
  }) {

  const {onClick: click, otherEvents = {}} = events;

  const onClick = useButtonClickControls({
    onClick: click,
    timeout,
    isDisposable,
    eventFunctions,
    callbacksData,
    modalsData
  });

  return (
    <button
      ref={ref}
      style={style}
      className={getTruthClasses(styles.button, className)}
      onClick={onClick}
      disabled={disabled}
      {...otherEvents}
    >
      {children}
    </button>
  );
};