import styles from "./Loader.module.scss";
import {AnimatePresence, motion} from "framer-motion";
import {loaderAnimation} from "../../constants/animation";

export default function Loader({isPending}) {
  return (
    <AnimatePresence>
      {isPending &&
        <motion.div className={styles.loader} {...loaderAnimation}>
          <div className={styles.loaderSpinner}/>
        </motion.div>
      }
    </AnimatePresence>
  );
}