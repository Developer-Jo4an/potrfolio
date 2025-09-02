import styles from "./Button.module.scss";
import getTruthClasses from "../../../../lib/classes/getTruthClasses";
import useButtonClickControls from "../../model/hooks/useButtonClickControls";

export default function Button(
  {
    ref,
    className,
    isDisabled: disabled = false,
    isDisposable = false,
    timeout = 300,
    events = {},
    eventFunctions = [],
    callbacksData = {},
    children
  }) {

  const {onClick: click, otherEvents = {}} = events;

  const {onClick, isDisabled} = useButtonClickControls({
    onClick: click,
    timeout,
    isDisposable,
    eventFunctions,
    callbacksData
  });

  return (
    <button
      ref={ref}
      className={getTruthClasses(styles.button, className)}
      onClick={onClick}
      disabled={disabled || isDisabled}
      {...otherEvents}
    >
      {children}
    </button>
  );
};