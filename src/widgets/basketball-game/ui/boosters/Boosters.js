import {useEffect, useRef} from "react";
import {Image} from "@shared";
import {useBoosters} from "../../model/hooks/useBoosters";
import {BottomMenu, MODES} from "@entities/bottom-menu";
import {useBasketballStore} from "../../model/state-manager/basketballStore";
import {PLAYING} from "../../controllers/constants/stateMachine";
import content from "../../constants/content";
import styles from "./Boosters.module.scss";

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
      className: styles.booster,
      onClick: () => onClick(type),
      isActive,
      isDisabled: !isCanUse || !count,
      img: {...img, className: styles[img.className]},
      value: count,
      child: (
        <div className={styles[background.className]}>
          <Image {...background} />
        </div>
      ),
      timeout,
    };
  });

  return <BottomMenu ref={elementsRef} buttons={boosterButtons} mod={MODES.orange} />;
}
