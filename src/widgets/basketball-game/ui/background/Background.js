import styles from "./Background.module.scss";
import {Image} from "../../../../shared/ui/image";
import content from "../../constants/content";

const {background} = content;

export default function Background() {
  return (
    <div className={styles.background}>
      <Image src={background.src} className={styles.backgroundImg}/>
    </div>
  );
}