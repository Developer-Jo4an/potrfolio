import {useEffect, useRef, useState} from "react";
import {createArrayWithMap} from "../../../../shared/lib/src/array/createArrayWithMap";
import eventSubscription from "../../../../shared/lib/src/events/eventListener";
import {TbStarsFilled} from "react-icons/tb";
import {FaStar} from "react-icons/fa6";
import useDunkShotStar from "../../model/hooks/useDunkShotStar";
import useActiveBoosters from "../../model/hooks/useActiveBoosters";
import useDunkShotStore from "../../model/state-manager/dunkShotStore";
import {THROW_HIT} from "../../constants/events";
import {X2} from "../../constants/boosters";
import styles from "./DunkShotStar.module.scss";

export default function DunkShotStar({topMenuEls}) {
  const {wrapper} = useDunkShotStore();
  const [StarComponent, setStarComponent] = useState(<FaStar/>);

  const elementRefs = useRef({stars: []});

  const starAnimation = useDunkShotStar();

  const {[X2]: isActiveX2} = useActiveBoosters() ?? {};

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

            setStarComponent(isActiveX2 ? <TbStarsFilled/> : <FaStar/>);

            starAnimation(stars, from, to);
          }
        }
      ]
    });
  }, [wrapper, isActiveX2]);

  return (
    <>
      {createArrayWithMap(5, (_, i) => (
        <div
          key={i}
          ref={ref => elementRefs.current.stars[i] = ref}
          className={styles.star}
        >
          {StarComponent}
        </div>
      ))}
    </>
  );
}