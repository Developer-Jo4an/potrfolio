import {useEffect, useRef, useState} from "react";
import cl from "classnames";
import styles from "./Button.module.scss";
import {getIsDebug} from "../../../utils/debug/debug";
import {useAppCallbacks} from "../../../providers/CallbacksProvider";
import {useModal} from "../../../providers/ModalProvider";

export default function Button(
  {
    isDisabled: disabled,
    isDisposable,
    timeout,
    events = {},
    className,
    extraCallback = {},
    callbacks = [],
    modals = [],
    ref,
    children
  }) {
  const [{isDisabled}, setSettings] = useState({isDisabled: false});

  if (isDisposable && typeof timeout === "number" && getIsDebug())
    throw new Error("isDisposable prop and timeout prop can't use at the same time");

  const properties = useRef({disabledTimeout: null});

  const {onClick: click, otherEvents = {}} = events;

  const appCallbacks = useAppCallbacks();

  const {add, close} = useModal();

  const totalCallbacks = {...appCallbacks, ...extraCallback};

  const onClick = e => {
    if (isDisabled) return;

    if (isDisposable)
      setSettings(prev => ({...prev, isDisabled: true}));

    if (typeof timeout === "number") {
      setSettings(prev => ({...prev, isDisabled: true}));

      properties.current.disabledTimeout = setTimeout(
        () => {
          setSettings(prev => ({...prev, isDisabled: false}));
          properties.current.disabledTimeout = null;
        },
        timeout
      );
    }

    callbacks?.forEach?.(({callback, options}) => totalCallbacks[callback]?.(options));

    modals?.forEach?.(({action, options}) => {
      ({
        add() {
          add(options);
        },
        close() {
          close(options);
        }
      })[action]?.(options);
    });

    click?.(e);
  };

  useEffect(() => typeof properties.current.disabledTimeout === "number" && clearTimeout(properties.current.disabledTimeout), []);

  return (
    <button
      ref={ref}
      className={cl(...[styles.button, className].filter(Boolean))}
      {...otherEvents}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};