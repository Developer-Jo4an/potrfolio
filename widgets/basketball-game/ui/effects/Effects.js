import useBasketballStore from "../../model/state-manager/basketballStore";
import {useEffect, useRef, useState} from "react";
import eventSubscription from "../../../../shared/lib/events/eventListener";
import clearHitTween from "../../lib/animations/clearHitTween";
import {CLEAR_HIT} from "../../constants/events";
import styles from "./Effects.module.scss";

export default function Effects() {
  const {wrapper} = useBasketballStore();
  const [{isVisibleClearHitEffect}, setVisibleEffects] = useState({isVisibleClearHitEffect: false});
  const animatedElements = useRef({clearHitEffect: null});

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: CLEAR_HIT,
          callback() {
            setVisibleEffects(prev => ({...prev, isVisibleClearHitEffect: true}));
          }
        }
      ]
    });
  }, [wrapper]);

  useEffect(() => {
    if (!isVisibleClearHitEffect) return;

    const clearHitElement = animatedElements.current.clearHitEffect;

    return clearHitTween(clearHitElement, () => setVisibleEffects(prev => ({...prev, isVisibleClearHitEffect: false})));
  }, [isVisibleClearHitEffect]);

  return (
    <div className={styles.effects}>
      {isVisibleClearHitEffect &&
        <div
          ref={ref => animatedElements.current.clearHitEffect = ref}
          className={styles.clearHitEffect}
        />
      }
    </div>
  );
}