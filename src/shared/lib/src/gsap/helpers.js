import {isFunction} from "lodash";
import getIsDebug from "../debug/debug";
import gsap from "gsap";

export function gsapTimeout({timeout, namespace, id, onComplete, onUpdate, onStart}) {
  if (!namespace || !id || typeof timeout !== "number") {
    console.error(timeout, onComplete, namespace, id);
    if (getIsDebug())
      throw new Error("incorrectProps");
  }

  const timeoutTween = gsap.to({}, {
    duration: timeout,
    ease: "none",
    onStart() {
      isFunction(onStart) && onStart(this);
    },
    onUpdate() {
      isFunction(onUpdate) && onUpdate(this);
    }
  }).save?.(namespace, id);

  return new Promise(res => timeoutTween.eventCallback("onComplete", () => {
    timeoutTween.delete?.(namespace);
    typeof onComplete === "function" && onComplete(timeoutTween);
    res();
  }));
}

export function gsapUpdate({namespace, id, onUpdate, onStart}) {
  if (!namespace || !id) {
    console.error(namespace, id);
    if (getIsDebug())
      throw new Error("incorrectProps");
  }

  return gsap.to({}, {
    duration: Number.MAX_VALUE,
    ease: "none",
    onStart() {
      isFunction(onStart) && onStart(this);
    },
    onUpdate() {
      isFunction(onUpdate) && onUpdate(this);
    }
  })?.save?.(namespace, id);
}
