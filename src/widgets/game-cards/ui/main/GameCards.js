import {GameCardsInfo} from "../info/GameCardsInfo";
import {GameCardsList} from "../cards/GameCardsList";
import {GameCardsNavigation} from "../navigation/GameCardsNavigation";
import {GameCardsBackground} from "../background/GameCardsBackground";
import {GameCardsButtons} from "../buttons/GameCardsButtons";
import {MouseTrailArea} from "@shared";
import {useReset} from "../../model/hooks/useReset";
import {useGetGames} from "../../model/hooks/useGetGames";
import styles from "./GameCards.module.scss";

export function GameCards() {
  useGetGames();
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