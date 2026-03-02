import {useEffect, useRef} from "react";
import {Image} from "@shared";
import {Boosters as BoostersMenu} from "@entities/boosters";
import {useBoosters} from "../../model/hooks/useBoosters";
import {useBasketballStore} from "../../model/state-manager/basketballStore";
import {MODES} from "@entities/bottom-menu";
import {PLAYING} from "../../controllers/constants/stateMachine";
import content from "../../constants/content";

const {boosters} = content;

export function Boosters({gameSpace, updateProps}) {
  const {state} = useBasketballStore();
  const onClick = useBoosters();
  const elementsRef = useRef();

  useEffect(() => {
    updateProps({boosters: elementsRef.current});
  }, []);

  const isCanUse =
    state === PLAYING &&
    !gameSpace.characterMovement.returnsBack &&
    !gameSpace.characterMovement.thrown &&
    !gameSpace.characterMovement.isCollisionWithRing &&
    !gameSpace.characterMovement.isCollisionWithSensor &&
    !gameSpace.characterMovement.isDrag &&
    !gameSpace.booster.active;

  const boosterButtons = boosters.map(({type, timeout, background, img}) => {
    const {booster} = gameSpace;
    const count = booster[type];
    const isActive = booster.active && type === booster.active;

    return {
      id: type,
      onClick: () => onClick(type),
      isActive,
      isDisabled: !isCanUse || !count,
      img,
      value: count,
      timeout,
      child: (styles) => (
        <div className={styles.background}>
          <Image {...background} />
        </div>
      ),
    };
  });

  return <BoostersMenu ref={elementsRef} list={boosterButtons} mod={MODES.orange} />;
}
