import cl from "classnames";
import {dataAttrs} from "@shared";
import styles from "./Title.module.scss";

export function Title({mod, text, status}) {
  return (
    <div className={styles.title} {...dataAttrs({mod, status})}>
      <p className={cl(styles.text)}>{text}</p>
    </div>
  );
}