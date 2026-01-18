import GameCardsInfo from "../info/GameCardsInfo";
import GameCardsList from "../cards/GameCardsList";
import GameCardsNavigation from "../navigation/GameCardsNavigation";
import GameCardsBackground from "../background/GameCardsBackground";
import GameCardsButtons from "../buttons/GameCardsButtons";
import {MouseTrailArea} from "../../../../shared/ui/mouse-trail-area";
import useReset from "../../model/hooks/useReset";
import styles from "./GameCards.module.scss";

export default function GameCards() {
  useReset();
  return (
    <>
      <section className={styles.gameCards}>
        <GameCardsBackground/>
        <GameCardsInfo/>
        <GameCardsList/>
        <GameCardsNavigation/>
        <GameCardsButtons/>
      </section>
      <MouseTrailArea/>
    </>
  );
}