import {Image} from "@shared";
import styles from "./Background.module.scss";
import content from "../../constants/content";

const {background} = content;

export function Background() {
  return (
    <div className={styles.background}>
      <Image {...background} />
    </div>
  );
}
