import {Image} from "../../../image";
import styles from "./Glow.module.scss";

export function Glow() {
  return (
    <div className={styles.glow}>
      <Image src={"shared/glow/glow.png"} className={styles.glowImage}/>
    </div>
  );
}