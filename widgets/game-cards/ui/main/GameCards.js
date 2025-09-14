import GameCardsInfo from "../info/GameCardsInfo";
import GameCardsList from "../cards/GameCardsList";
import GameCardsNavigation from "../navigation/GameCardsNavigation";
import GameCardsButtons from "../buttons/GameCardsButtons";
import GameCardsBackground from "../background/GameCardsBackground";
import {MouseTrailArea} from "../../../../shared/ui/mouse-trail-area";
import styles from "./GameCards.module.scss";

export default function GameCards() {
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