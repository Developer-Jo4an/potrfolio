import {useEffect, useRef, useState} from "react";
import {Image} from "../../../../shared/ui/image";
import {createArrayWithMap} from "../../../../shared/lib/array/createArrayWithMap";
import {eventSubscription} from "../../../../shared/lib/events/eventListener";
import useDunkShotStar from "../../model/hooks/animations/useDunkShotStar";
import useDunkShotStore from "../../model/state-manager/dunkShotStore";
import {THROW_HIT} from "../../constants/events";
import {FIVE} from "../../../../shared/constants/numbers/numbers";
import styles from "./DunkShotStar.module.scss";

export default function DunkShotStar({topMenuEls}) {
  const {wrapper} = useDunkShotStore();
  const [starsSrc, setStarsSrc] = useState("widgets/dunk-shot-game/star.png");

  const elementRefs = useRef({stars: []});

  const starAnimation = useDunkShotStar();

  // const {[X2]: isActiveX2} = useActiveBoosters() ?? {};
  let isActiveX2 = false;

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: THROW_HIT,
          callback({position: from}) {
            const {stars} = elementRefs.current;
            const {scoreIcon: to} = topMenuEls.current;

            setStarsSrc(
              isActiveX2
                ? "widgets/dunk-shot-game/boosters/x2.png"
                : "widgets/dunk-shot-game/star.png"
            );

            starAnimation(stars, from, to);
          }
        }
      ]
    });
  }, [wrapper, isActiveX2]);

  return (
    <>
      {createArrayWithMap(FIVE, (_, i) => (
        <div
          key={i}
          ref={ref => elementRefs.current.stars[i] = ref}
          className={styles.star}
        >
          <Image src={starsSrc}/>
        </div>
      ))}
    </>
  );
}