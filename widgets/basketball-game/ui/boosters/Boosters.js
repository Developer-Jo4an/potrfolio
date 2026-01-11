import {BottomMenu} from "../../../../features/bottom-menu";
import Image from "../../../../shared/ui/image/ui/main/Image";
import useBoosters from "../../model/hooks/useBoosters";
import useBasketballStore from "../../model/state-manager/basketballStore";
import {PLAYING} from "../../constants/stateMachine";
import content from "../../constants/content";
import styles from "./Boosters.module.scss";

const {boosters} = content;

export default function Boosters({gameSpace}) {
  const {state} = useBasketballStore();
  const onClick = useBoosters();

  const isCanUse = (
    state === PLAYING &&
    !gameSpace.characterMovement.returnsBack &&
    !gameSpace.characterMovement.thrown &&
    !gameSpace.characterMovement.isCollisionWithRing &&
    !gameSpace.characterMovement.isCollisionWithSensor &&
    !gameSpace.characterMovement.isDrag &&
    !gameSpace.booster.active
  );

  const boosterButtons = boosters.map(({type, timeout, background, img}) => ({
    className: styles.booster,
    onClick: () => onClick(type),
    isDisabled: !isCanUse,
    img: {...img, className: styles[img.className]},
    child: (
      <div className={styles[background.className]}>
        <Image src={background.src}/>
      </div>
    ),
    timeout
  }));

  return (
    <BottomMenu buttons={boosterButtons}/>
  );
}