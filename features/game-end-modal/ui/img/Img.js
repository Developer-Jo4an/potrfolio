import Image from "../../../../shared/ui/image/ui/main/Image";
import cl from "classnames";
import styles from "./Img.module.scss";

export default function Img(img) {
  return (
    <div className={styles.imageContainer}>
      <Image {...img} className={cl(styles.image, img.className)}/>
    </div>
  );
}