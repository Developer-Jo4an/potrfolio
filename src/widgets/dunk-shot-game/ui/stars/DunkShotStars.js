import {useEffect, useRef, useState} from "react";
import {isArray, isFinite} from "lodash";
import {eventSubscription, createArrayWithMap} from "@shared";
import {useDunkShotStars} from "../../model/hooks/useDunkShotStars";
import {TbStarsFilled} from "react-icons/tb";
import {FaStar} from "react-icons/fa6";
import {useActiveBoosters} from "../../model/hooks/useActiveBoosters";
import {useDunkShotStore} from "../../model/state-manager/dunkShotStore";
import {THROW_HIT} from "../../constants/events";
import {X2} from "../../constants/boosters";
import styles from "./DunkShotStars.module.scss";

export function DunkShotStars({topMenuEls, progressBarEls}) {
  const {wrapper} = useDunkShotStore();
  const {gameData: {progress: {current, max} = {}} = {}} = useDunkShotStore();
  const [StarComponent, setStarComponent] = useState(<FaStar/>);

  const elementRefs = useRef({stars: []});

  const starsAnimation = useDunkShotStars();

  const {[X2]: isActiveX2} = useActiveBoosters() ?? {};

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: THROW_HIT,
          callback() {
            setStarComponent(isActiveX2 ? <TbStarsFilled/> : <FaStar/>);
          }
        }
      ]
    });
  }, [wrapper, isActiveX2]);

  useEffect(() => {
    if ([current, max].every(isFinite) && current === max) {
      const {stars} = elementRefs.current;
      const {scoreIcon: to} = topMenuEls.current;
      const {score: from} = progressBarEls.current;
      starsAnimation(stars, from, to);
    }
  }, [current, max]);

  return (
    <>
      {createArrayWithMap(5, (_, groupIndex) =>
        createArrayWithMap(5, (_, starIndex) => (
          <div
            key={`${groupIndex}-${starIndex}`}
            ref={ref => {
              if (!isArray(elementRefs.current.stars[groupIndex]))
                elementRefs.current.stars[groupIndex] = [];
              elementRefs.current.stars[groupIndex][starIndex] = ref;
            }}
            className={styles.star}
          >
            {StarComponent}
          </div>
        ))
      )}
    </>
  );
}