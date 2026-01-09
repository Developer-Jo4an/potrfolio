import useBasketballStore from "../../model/state-manager/basketballStore";
import {Button} from "../../../../shared/ui/button";
import {Image} from "../../../../shared/ui/image";
import cl from "classnames";
import useBoosters from "../../model/hooks/useBoosters";
import content from "../../constants/content";
import styles from "./Boosters.module.scss";
import {PLAYING} from "../../constants/stateMachine";

const {boosters} = content;

export default function Boosters() {
  const {state} = useBasketballStore();
  const onClick = useBoosters();

  return (
    <div className={styles.boosters}>
      {boosters.map(({type, img, className}) => (
        <Button
          key={type}
          isDisabled={state !== PLAYING}
          className={cl(styles.booster, styles[className])}
          events={{onClick: () => onClick(type)}}
        >
          <Image src={img}/>
        </Button>
      ))}
    </div>
  );
}