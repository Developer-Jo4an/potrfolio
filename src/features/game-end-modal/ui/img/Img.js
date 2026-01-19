import {Image} from "@shared";
import cl from "classnames";
import styles from "./Img.module.scss";

export function Img(img) {
  return (
    <div className={styles.imageContainer}>
      <Image {...img} className={cl(styles.image, img.className)}/>
    </div>
  );
}