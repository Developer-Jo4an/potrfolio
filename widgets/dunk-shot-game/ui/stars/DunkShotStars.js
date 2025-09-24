import {useEffect, useRef, useState} from "react";
import {isArray, isNumber} from "lodash";
import {eventSubscription} from "../../../../shared/lib/events/eventListener";
import {Image} from "../../../../shared/ui/image";
import {useDunkShotStars} from "../../model/hooks/animations/useDunkShotStars";
import {createArrayWithMap} from "../../../../shared/lib/array/createArrayWithMap";
import {THROW_HIT} from "../../constants/events";
import {FIVE} from "../../../../shared/constants/numbers/numbers";
import useDunkShotStore from "../../model/state-manager/dunkShotStore";
import styles from "./DunkShotStars.module.scss";

export default function DunkShotStars({topMenuEls, progressRefs}) {
  const {wrapper} = useDunkShotStore();
  const {gameData: {progress: {current, max} = {}} = {}} = useDunkShotStore();
  const [starsSrc, setStarsSrc] = useState("widgets/dunk-shot-game/star.png");

  const elementRefs = useRef({stars: []});

  const starsAnimation = useDunkShotStars();

  // const {[x2]: isActiveX2} = useActiveBoosters() ?? {};
  let isActiveX2 = false;

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: THROW_HIT,
          callback() {
            setStarsSrc(
              isActiveX2
                ? "widgets/dunk-shot-game/boosters/x2.png"
                : "widgets/dunk-shot-game/star.png"
            );
          }
        }
      ]
    });
  }, [wrapper, isActiveX2]);

  useEffect(() => {
    if ([current, max].every(isNumber) && current === max) {
      const {stars} = elementRefs.current;
      const {scoreIcon: to} = topMenuEls.current;
      const {progress: {current: from}} = progressRefs.current;
      starsAnimation(stars, from, to);
    }
  }, [current, max]);

  return (
    <>
      {createArrayWithMap(FIVE, (_, groupIndex) =>
        createArrayWithMap(FIVE, (_, starIndex) => (
          <div
            key={`${groupIndex}-${starIndex}`}
            ref={ref => {
              if (!isArray(elementRefs.current.stars[groupIndex]))
                elementRefs.current.stars[groupIndex] = [];
              elementRefs.current.stars[groupIndex][starIndex] = ref;
            }}
            className={styles.star}
          >
            <Image src={starsSrc}/>
          </div>
        ))
      )}
    </>
  );
}