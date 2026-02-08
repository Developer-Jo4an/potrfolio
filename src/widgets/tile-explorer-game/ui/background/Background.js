import styles from "./Background.module.scss";
import {Image} from "@shared";
import content from "../../constants/content";

const {background} = content;

export function Background() {
  return (
    <div className={styles.background}>
      <Image src={background.src} className={styles.backgroundImg} />
    </div>
  );
}
