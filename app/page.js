"use client";
import styles from "../styles/main.module.scss";
import {useGames} from "../stateManager/appStore";
import {adjustable} from "../content/adjustable";
import {motion} from "framer-motion";
import {animation} from "../animations/gameCard/gameCard";
import GameCard from "../components/business/gameCard/GameCard";
import {useRequestHandler} from "../hooks/useRequestHandler";
import {useMemo} from "react";
import {useAppCallbacks} from "../providers/CallbacksProvider";

const {mainTitle, redirectData} = adjustable;

export default function Adjustable() {
  const {games} = useGames();

  const appCallbacks = useAppCallbacks();

  useRequestHandler(
    useMemo(() => redirectData.map(({request, to}) => ({
      request,
      onFulfilled: () => appCallbacks.requestPage(to)
    })), [])
  );

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.mainTitle}>{mainTitle}</h1>

      <ul className={styles.gameList} style={{"--elements-count": games.length}}>
        {games.map((game, index) =>
          <motion.li
            key={index}
            className={styles.gameItem}
            {...animation(index)}
          >
            <GameCard game={game}/>
          </motion.li>
        )}
      </ul>
    </section>
  );
}
