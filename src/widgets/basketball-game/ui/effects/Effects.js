import {useEffect, useImperativeHandle, useRef, useState} from "react";
import {hitTween} from "../../utils/animations/hitTween";
import {eventSubscription, Image} from "@shared";
import {useBasketballStore} from "../../model/state-manager/basketballStore";
import {CLEAR_HIT, MISS} from "../../constants/events";
import content from "../../constants/content";
import {BASKETBALL} from "../../constants/game";
import {PLAYING} from "../../constants/stateMachine";
import styles from "./Effects.module.scss";

const {effects: {clearHit, miss}} = content;

export function Effects({ref}) {
  const {wrapper, state} = useBasketballStore();
  const [{isVisibleClearHitEffect, isVisibleMissEffect}, setVisibleEffects] = useState({
    isVisibleClearHitEffect: false,
    isVisibleMissEffect: false
  });
  const animatedElements = useRef({clearHitEffect: null, missEffect: null});
  const effectsFreeSpaceRef = useRef();

  useImperativeHandle(ref, () => effectsFreeSpaceRef.current);

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
        },
        {
          event: MISS,
          callback() {
            setVisibleEffects(prev => ({...prev, isVisibleMissEffect: true}));
          }
        }
      ]
    });
  }, [wrapper]);

  useEffect(() => {
    if (state !== PLAYING) {
      setVisibleEffects(prev => {
        const newData = {};
        for (const key in prev)
          newData[key] = false;
        return newData;
      });

      return;
    }

    if (!isVisibleClearHitEffect && !isVisibleMissEffect) return;

    const {clearHitEffect, missEffect} = animatedElements.current;

    const animatedData = [
      isVisibleClearHitEffect && {
        DOMElement: clearHitEffect,
        clear: () => setVisibleEffects(prev => ({...prev, isVisibleClearHitEffect: false}))
      },
      isVisibleMissEffect && {
        DOMElement: missEffect,
        clear: () => setVisibleEffects(prev => ({...prev, isVisibleMissEffect: false}))
      }
    ].filter(Boolean);

    const clearFunctions = animatedData.map(({DOMElement, clear}) => {
      const tween = hitTween(DOMElement, clear);
      return () => !tween.isKilled && tween.delete(BASKETBALL);
    });

    return () => clearFunctions.forEach(func => func());
  }, [state, isVisibleClearHitEffect, isVisibleMissEffect]);

  return (
    <div className={styles.effects}>
      {isVisibleClearHitEffect &&
        <div
          ref={ref => animatedElements.current.clearHitEffect = ref}
          className={styles.clearHitEffect}
        >
          <Image {...clearHit.img}/>
        </div>
      }

      {isVisibleMissEffect &&
        <div
          ref={ref => animatedElements.current.missEffect = ref}
          className={styles.missEffect}
        >
          <Image {...miss.img}/>
        </div>
      }

      <div ref={effectsFreeSpaceRef} className={styles.effectsFreeSpace}/>
    </div>
  );
}