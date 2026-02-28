import {Image} from "@shared";
import {BottomMenu, MODES} from "@entities/bottom-menu";
import {useBoosters} from "../../model/hooks/useBoosters";
import {useTileExplorerStore} from "../../model/state-manager/tileExplorerStore";
import {PLAYING} from "../../controllers/constants/stateMachine";
import content from "../../constants/content";
import styles from "./Boosters.module.scss";

const {boosters} = content;

export function Boosters({gameSpace: {gameData}}) {
  const {state} = useTileExplorerStore();

  const {onClick} = useBoosters();

  const isCanUse = state === PLAYING && !gameData.booster?.active;

  const boosterButtons = boosters.map(({type, timeout, background, img}) => {
    const count = gameData?.booster?.[type];

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

  return <BottomMenu buttons={boosterButtons} mod={MODES.blue} />;
}
