import styles from "./Error.module.scss";
import {isObject, isString} from "lodash";
import {Button} from "../../button";
import {Image} from "../../image";
import {motion} from "framer-motion";
import {notFoundAnimation} from "../constants/animations";

export function Error({error, message, button}) {
  return (
    <div className={styles.error}>
      <Image src={"app/404.png"} className={styles.background}/>

      <div className={styles.messageWrapper}>
        <motion.div {...notFoundAnimation}>
          <div className={styles.messageModal}>
            {isString(error) && <div className={styles.messageNumber}>{error}</div>}
            {isString(message) && <div className={styles.message}>{message}</div>}
            {isObject(button) && <Button className={styles.button} {...button}>{button.text}</Button>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}