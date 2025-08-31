import styles from "./Loader.module.scss";
import {AnimatePresence, motion} from "framer-motion";
import {animation} from "../../../animations/loader/animations";
import {useRequestHandler} from "../../../hooks/useRequestHandler";

export default function Loader() {
  const {isPendingSome} = useRequestHandler();

  return (
    <AnimatePresence>
      {isPendingSome &&
        <motion.div className={styles.loader} {...animation}>
          <div className={styles.loaderSpinner}/>
        </motion.div>
      }
    </AnimatePresence>
  );
}