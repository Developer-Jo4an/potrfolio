import {Image} from "../../../image/index";
import styles from "./Glow.module.scss";

export default function Glow() {
  return (
    <div className={styles.glow}>
      <Image src={"shared/glow/glow.png"} className={styles.glowImage}/>
    </div>
  );
}