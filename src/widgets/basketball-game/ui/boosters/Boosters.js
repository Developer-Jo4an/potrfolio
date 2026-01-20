import {useImperativeHandle, useRef} from "react";
import {Image} from "@shared";
import {useBoosters} from "../../model/hooks/useBoosters";
import {BottomMenu} from "../../../../features/bottom-menu";
import {useBasketballStore} from "../../model/state-manager/basketballStore";
import {PLAYING} from "../../constants/stateMachine";
import {MODES} from "../../../../features/bottom-menu";
import content from "../../constants/content";
import styles from "./Boosters.module.scss";

const {boosters} = content;

export function Boosters({gameSpace, ref}) {
  const {state} = useBasketballStore();
  const onClick = useBoosters();
  const elementsRef = useRef();

  useImperativeHandle(ref, () => elementsRef.current);

  const isCanUse =
    state === PLAYING &&
    !gameSpace.characterMovement.returnsBack &&
    !gameSpace.characterMovement.thrown &&
    !gameSpace.characterMovement.isCollisionWithRing &&
    !gameSpace.characterMovement.isCollisionWithSensor &&
    !gameSpace.characterMovement.isDrag &&
    !gameSpace.booster.active;

  const boosterButtons = boosters.map(({type, timeout, background, img}) => {
    const count = gameSpace.booster[type];
    return {
      id: type,
      className: styles.booster,
      onClick: () => onClick(type),
      isDisabled: !isCanUse || !count,
      img: {...img, className: styles[img.className]},
      value: count,
      child: (
        <div className={styles[background.className]}>
          <Image src={background.src} />
        </div>
      ),
      timeout,
    };
  });

  return <BottomMenu ref={elementsRef} buttons={boosterButtons} mod={MODES.orange} />;
}
