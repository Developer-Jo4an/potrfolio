"use client";
import "../styles/zeroing.scss";
import styles from "../styles/main.module.scss";
import {useModalContext} from "../providers/ModalProvider";

export default function Adjustable() {
  const {add, close} = useModalContext();

  return (
    <div className={styles.wrapper}>
      Hello world!
    </div>
  );
}
