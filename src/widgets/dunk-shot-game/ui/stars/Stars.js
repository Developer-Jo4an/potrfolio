import {useEffect, useRef, useState} from "react";
import {isArray, isFinite} from "lodash";
import {eventSubscription, createArrayWithMap} from "@shared";
import {useStars} from "../../model/hooks/useStars";
import {TbStarsFilled} from "react-icons/tb";
import {FaStar} from "react-icons/fa6";
import {useActiveBoosters} from "../../model/hooks/useActiveBoosters";
import {useDunkShotStore} from "../../model/state-manager/dunkShotStore";
import {THROW_HIT} from "../../controllers/constants/events";
import {X2} from "../../controllers/constants/boosters";
import styles from "./Stars.module.scss";

export function Stars({topMenu, progressBar}) {
  const {wrapper} = useDunkShotStore();
  const {gameData: {progress: {current, max} = {}} = {}} = useDunkShotStore();
  const [StarComponent, setStarComponent] = useState(<FaStar />);

  const elementRefs = useRef({stars: []});

  const starsAnimation = useStars();

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
            setStarComponent(isActiveX2 ? <TbStarsFilled /> : <FaStar />);
          },
        },
      ],
    });
  }, [wrapper, isActiveX2]);

  useEffect(() => {
    if ([current, max].every(isFinite) && current === max) {
      const {stars} = elementRefs.current;
      const {scoreIcon: to} = topMenu;
      const {score: from} = progressBar;
      starsAnimation(stars, from, to);
    }
  }, [current, progressBar, topMenu, max]);

  return (
    <>
      {createArrayWithMap(5, (_, groupIndex) =>
        createArrayWithMap(5, (_, starIndex) => (
          <div
            key={`${groupIndex}-${starIndex}`}
            ref={(ref) => {
              if (!isArray(elementRefs.current.stars[groupIndex])) elementRefs.current.stars[groupIndex] = [];
              elementRefs.current.stars[groupIndex][starIndex] = ref;
            }}
            className={styles.star}>
            {StarComponent}
          </div>
        )),
      )}
    </>
  );
}
