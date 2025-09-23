import {useEffect, useRef, useState} from "react";
import {arrayedElements} from "../../../utils/arrayedElements";
import {image} from "../../../utils/data/baseUrl";
import {isArray} from "lodash";
import {useDunkShot} from "../../../redux/reducer/app";
import {dunkShotStars} from "../../../animations/dunkShotStars";
import {x2} from "../../../constants/games/basketball/boosters";
import {useActiveBoosters} from "../../../hooks/game/dunkShot/useActiveBoosters";
import {scenesManager} from "../../../controllers/scene/ScenesManager";
import {dunkShotWrapperId} from "../../../constants/games/dunkShot/constants";
import {eventSubscription} from "../../../utils/events/eventSubscription";

export default function DunkShotStarsGameElement({navRefs, progressRefs}) {
  const wrapper = scenesManager.wrappers[dunkShotWrapperId];
  const {progress: {current, max}} = useDunkShot();
  const [starsSrc, setStarsSrc] = useState(image("dunkShot/gameElements/star.png"));

  const elementRefs = useRef({stars: []});

  const starsAnimation = dunkShotStars();

  const {[x2]: isActiveX2} = useActiveBoosters() ?? {};

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: "throw:hit", callback() {
            setStarsSrc(
              image(isActiveX2
                ? "game/boosters/x2.png"
                : "dunkShot/gameElements/star.png"
              )
            );
          }
        }
      ]
    });
  }, [wrapper, isActiveX2]);

  useEffect(() => {
    if (current === max) {
      const {stars} = elementRefs.current;
      const {star: {current: to}} = navRefs.current;
      const {progress: {current: from}} = progressRefs.current;
      starsAnimation(stars, from, to);
    }
  }, [current, max]);

  return (
    <>
      {arrayedElements(5, (_, groupIndex) =>
        arrayedElements(5, (_, starIndex) => (
          <div
            key={`${groupIndex}-${starIndex}`}
            ref={ref => {
              if (!isArray(elementRefs.current.stars[groupIndex]))
                elementRefs.current.stars[groupIndex] = [];
              elementRefs.current.stars[groupIndex][starIndex] = ref;
            }}
            className={"dunk-shot-game-elements__star"}
          >
            <img src={starsSrc}/>
          </div>
        ))
      )}
    </>
  );
}