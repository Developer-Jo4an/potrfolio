import {useImperativeHandle, useRef} from "react";
import {Image} from "@shared";
import {BottomMenu, MODES} from "@features/bottom-menu";
import {useBoosters} from "../../model/hooks/useBoosters";
import {useTileExplorerStore} from "../../model/state-manager/tileExplorerStore";
import {PLAYING} from "../../constants/stateMachine";
import content from "../../constants/content";
import styles from "./Boosters.module.scss";

const {boosters} = content;

export function Boosters({gameSpace, ref}) {
  const {state} = useTileExplorerStore();
  const elementsRef = useRef();

  const {onClick} = useBoosters();

  useImperativeHandle(ref, () => elementsRef.current);

  const isCanUse = state === PLAYING && !gameSpace.booster.active;

  const boosterButtons = boosters.map(({type, timeout, background, img}) => {
    const count = gameSpace?.booster[type];

    return {
      id: type,
      className: styles.booster,
      onClick: () => onClick(type),
      isDisabled: !isCanUse || !count,
      img: {...img, className: styles[img.className]},
      value: count,
      child: (
        <div className={styles[background.className]}>
          <Image src={background.src}/>
        </div>
      ),
      timeout
    };
  });

  return <BottomMenu ref={elementsRef} buttons={boosterButtons} mod={MODES.blue}/>;
}
