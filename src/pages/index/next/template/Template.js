"use client";
import {motion} from "framer-motion";
import {templateAnimation} from "../../constants/animations";
import styles from "./Template.module.scss";

export function Template({children}) {
  return (
    <div className={styles.templateWrapper}>
      <motion.div className={styles.animatedElement} {...templateAnimation}>
        {children}
      </motion.div>
    </div>
  );
}
