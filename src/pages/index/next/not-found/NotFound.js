"use client";
import {Image, Button} from "@shared";
import {useRouter} from "next/navigation";
import {motion} from "framer-motion";
import {notFoundAnimation} from "../../constants/animations";
import content from "../../constants/content";
import styles from "./NotFound.module.scss";

const {notFound: {error, button}} = content;

export function NotFound() {
  const router = useRouter();

  const onClick = () => router.push("/");

  return (
    <div className={styles.notFound}>
      <Image src={"app/404.png"} className={styles.background}/>

      <div className={styles.messageWrapper}>
        <motion.div {...notFoundAnimation}>
          <div className={styles.messageModal}>
            <div className={styles.messageNumber}>{error}</div>
            <Button className={styles.button} events={{onClick}}>{button.text}</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}