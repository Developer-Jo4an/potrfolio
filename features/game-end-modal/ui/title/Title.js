import cl from "classnames";
import dataAttrs from "../../../../shared/lib/styles/dataAttrs";
import styles from "./Title.module.scss";

export default function Title({mod, text, status}) {
  return (
    <div className={styles.title} {...dataAttrs({mod, status})}>
      <p className={cl(styles.text)}>{text}</p>
    </div>
  );
}