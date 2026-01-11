import {useSyncExternalStore} from "react";
import {Loader} from "../../../../shared/ui/loader";
import {TopMenu} from "../../../../features/top-menu";
import Canvas from "../canvas/Canvas";
import Background from "../background/Background";
import Effects from "../effects/Effects";
import Boosters from "../boosters/Boosters";
import usePause from "../../model/hooks/usePause";
import useBasketballStore from "../../model/state-manager/basketballStore";
import {INITIALIZATION, INITIALIZATION_LEVEL} from "../../constants/stateMachine";
import gameSpaceStore from "../../model/storages/gameSpace";
import content from "../../constants/content";
import styles from "./BasketballGame.module.scss";

const {menu: {score, lifes, sound}} = content;

export default function BasketballGame() {
  const {state} = useBasketballStore();
  const gameSpace = useSyncExternalStore(gameSpaceStore.subscribe, gameSpaceStore.getSnapshot);
  const pause = usePause({gameSpace});

  return (
    <div className={styles.basketballGame}>
      <Background/>
      <Canvas/>
      <TopMenu
        lifes={{count: gameSpace.gameData.lifes, ...lifes}}
        score={{count: gameSpace.gameData.score, ...score}}
        sound={sound}
        pause={pause}
      />
      <Effects/>
      <Boosters gameSpace={gameSpace}/>
      <Loader isPending={!state || [INITIALIZATION_LEVEL, INITIALIZATION].includes(state)}/>
    </div>
  );
}