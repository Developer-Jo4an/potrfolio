import cl from "classnames";
import {Image} from "@shared";
import styles from "./Background.module.scss";

export function Background(img) {
  return (
    <div className={styles.background}>
      <Image {...img} className={cl(styles.image, img.className)} />
    </div>
  );
}
