"use client";
import {Basketball as BasketballScene} from "../../../../widgets/basketball/index";
import styles from "./Basketball.module.scss";

export default function Basketball() {
  return (
    <section className={styles.basketball}>
      <BasketballScene/>
    </section>
  );
}