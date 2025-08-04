"use client";
import "../styles/zeroing.scss";
import styles from "../styles/main.module.scss";
import {useEffect} from "react";
import useAppStore from "../stateManager/appStore";

export default function Adjustable() {
  const a = useAppStore();

  useEffect(() => {
    a.getGames();
  }, []);

  console.log(a);

  return (
    <div className={styles.wrapper}>
    </div>
  );
}
