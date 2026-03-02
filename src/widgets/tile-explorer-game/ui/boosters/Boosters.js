import {Image} from "@shared";
import {MODES} from "@entities/bottom-menu";
import {Boosters as BoostersMenu} from "@entities/boosters";
import {useBoosters} from "../../model/hooks/useBoosters";
import {useTileExplorerStore} from "../../model/state-manager/tileExplorerStore";
import {PLAYING} from "../../controllers/constants/stateMachine";
import content from "../../constants/content";

const {boosters} = content;

export function Boosters({gameSpace: {gameData}}) {
  const {state} = useTileExplorerStore();

  const {onClick} = useBoosters();

  const isCanUse = state === PLAYING && !gameData.booster?.active;

  const boosterButtons = boosters.map(({type, timeout, background, img}) => {
    const count = gameData?.booster?.[type];

    return {
      id: type,
      onClick: () => onClick(type),
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

  return <BoostersMenu list={boosterButtons} mod={MODES.blue} />;
}
