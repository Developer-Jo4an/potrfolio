import styles from "./Loader.module.scss";
import {AnimatePresence, motion} from "framer-motion";

export const animation = {
  initial: {opacity: 0},
  animate: {opacity: 1},
  exit: {opacity: 0}
};

export default function Loader({isPending}) {
  return (
    <AnimatePresence>
      {isPending &&
        <motion.div className={styles.loader} {...animation}>
          <div className={styles.loaderSpinner}/>
        </motion.div>
      }
    </AnimatePresence>
  );
}