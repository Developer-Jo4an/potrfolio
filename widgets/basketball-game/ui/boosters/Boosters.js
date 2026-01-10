import {useSyncExternalStore} from "react";
import {Button} from "../../../../shared/ui/button";
import {Image} from "../../../../shared/ui/image";
import cl from "classnames";
import useBoosters from "../../model/hooks/useBoosters";
import useBasketballStore from "../../model/state-manager/basketballStore";
import {PLAYING} from "../../constants/stateMachine";
import content from "../../constants/content";
import gameSpaceStore from "../../model/storages/gameSpace";
import styles from "./Boosters.module.scss";

const {boosters} = content;

export default function Boosters() {
  const {state} = useBasketballStore();
  const onClick = useBoosters();
  const gameSpace = useSyncExternalStore(gameSpaceStore.subscribe, gameSpaceStore.getSnapshot);

  const isCanUse = (
    state === PLAYING &&
    !gameSpace.characterMovement.returnsBack &&
    !gameSpace.characterMovement.thrown &&
    !gameSpace.characterMovement.isCollisionWithRing &&
    !gameSpace.characterMovement.isCollisionWithSensor &&
    !gameSpace.characterMovement.isDrag &&
    !gameSpace.booster.active
  );

  return (
    <div className={styles.boosters}>
      {boosters.map(({type, img, className}) => (
        <Button
          key={type}
          isDisabled={!isCanUse}
          className={cl(styles.booster, styles[className])}
          events={{onClick: () => onClick(type)}}
        >
          <Image src={img}/>
        </Button>
      ))}
    </div>
  );
}