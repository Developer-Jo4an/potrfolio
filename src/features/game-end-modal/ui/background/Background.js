import cl from "classnames";
import Image from "../../../../shared/ui/image/ui/main/Image";
import styles from "./Background.module.scss";

export default function Background(img) {
  return (
    <div className={styles.background}>
      <Image {...img} className={cl(styles.image, img.className)}/>
    </div>
  );
}