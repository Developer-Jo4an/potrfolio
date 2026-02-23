import {Image} from "@shared";
import cl from "classnames";
import styles from "./Img.module.scss";

export function Img({mod, ...img}) {
  return (
    <div className={styles.imageContainer} data-mod={mod}>
      <Image {...img} className={cl(styles.image, img.className)} />
    </div>
  );
}
