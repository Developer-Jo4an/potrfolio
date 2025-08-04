import styles from "./Loader.module.scss";
import {AnimatePresence, motion} from "framer-motion";
import {animation} from "../../../animations/loader/animations";

export default function Loader() {
  return (
    <AnimatePresence>
      {false &&
        <motion.div className={styles.loader} {...animation}>
          <div className={styles.loaderSpinner}/>
        </motion.div>
      }
    </AnimatePresence>
  );
}