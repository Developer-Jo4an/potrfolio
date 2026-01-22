"use client";
import {Image} from "@shared";
import {motion} from "framer-motion";
import content from "../../constants/content";
import {templateAnimation} from "../../constants/animations";
import styles from "./Template.module.scss";

const {background} = content;

export function Template({children}) {
  return (
    <div className={styles.templateWrapper}>
      <Image {...background} className={styles.background} />
      <motion.div className={styles.animatedElement} {...templateAnimation}>
        {children}
      </motion.div>
    </div>
  );
}
