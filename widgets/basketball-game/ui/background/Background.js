import styles from "./Background.module.scss";
import {Image} from "../../../../shared/ui/image";

export default function Background() {
  return (
    <div className={styles.background}>
      <Image src={"widgets/basketball-game/background.png"} className={styles.backgroundImg}/>
    </div>
  );
}