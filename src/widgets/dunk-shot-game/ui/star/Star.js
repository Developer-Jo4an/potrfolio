import {useEffect, useRef, useState} from "react";
import {eventSubscription, createArrayWithMap} from "@shared";
import {TbStarsFilled} from "react-icons/tb";
import {FaStar} from "react-icons/fa6";
import {useStar} from "../../model/hooks/useStar";
import {useActiveBoosters} from "../../model/hooks/useActiveBoosters";
import {useDunkShotStore} from "../../model/state-manager/dunkShotStore";
import {THROW_HIT} from "../../controllers/constants/events";
import {X2} from "../../controllers/constants/boosters";
import styles from "./Stars.module.scss";

export function Star({topMenu}) {
  const {wrapper} = useDunkShotStore();
  const [StarComponent, setStarComponent] = useState(<FaStar />);

  const elementRefs = useRef({stars: []});

  const starAnimation = useStar();

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
            const {scoreIcon: to} = topMenu;

            setStarComponent(isActiveX2 ? <TbStarsFilled /> : <FaStar />);

            starAnimation(stars, from, to);
          },
        },
      ],
    });
  }, [wrapper, topMenu, isActiveX2]);

  return (
    <>
      {createArrayWithMap(5, (_, i) => (
        <div key={i} ref={(ref) => (elementRefs.current.stars[i] = ref)} className={styles.star}>
          {StarComponent}
        </div>
      ))}
    </>
  );
}
