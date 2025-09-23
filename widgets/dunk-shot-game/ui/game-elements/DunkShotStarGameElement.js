import {scenesManager} from "../../../controllers/scene/ScenesManager";
import {useEffect, useRef, useState} from "react";
import {eventSubscription} from "../../../utils/events/eventSubscription";
import {dunkShotStar} from "../../../animations/dunkShotStar";
import {image} from "../../../utils/data/baseUrl";
import {arrayedElements} from "../../../utils/arrayedElements";
import {dunkShotWrapperId} from "../../../constants/games/dunkShot/constants";
import {useActiveBoosters} from "../../../hooks/game/dunkShot/useActiveBoosters";
import {x2} from "../../../constants/games/basketball/boosters";

export default function DunkShotStarGameElement({navRefs}) {
  const wrapper = scenesManager.wrappers[dunkShotWrapperId];
  const [starsSrc, setStarsSrc] = useState(image("dunkShot/gameElements/star.png"));

  const elementRefs = useRef({stars: []});

  const starAnimation = dunkShotStar();

  const {[x2]: isActiveX2} = useActiveBoosters() ?? {};

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: "throw:hit", callback({position: from}) {
            const {stars} = elementRefs.current;
            const {star: {current: to}} = navRefs.current;

            setStarsSrc(
              image(isActiveX2
                ? "game/boosters/x2.png"
                : "dunkShot/gameElements/star.png"
              )
            );

            starAnimation(stars, from, to);
          }
        }
      ]
    });
  }, [wrapper, isActiveX2]);

  return (
    <>
      {arrayedElements(5, (_, i) => (
        <div
          key={i}
          ref={ref => elementRefs.current.stars[i] = ref}
          className={"dunk-shot-game-elements__star"}
        >
          <img src={starsSrc}/>
        </div>
      ))}
    </>
  );
}