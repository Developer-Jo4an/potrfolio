import {useEffect, useRef} from "react";
import {Image} from "@shared";
import styles from "./Background.module.scss";

export function Background({content: {background}, updateProps}) {
  const backgroundRef = useRef();

  useEffect(() => {
    updateProps({background: backgroundRef.current});
  }, []);

  return (
    <div ref={backgroundRef} className={styles.background}>
      <Image {...background} className={styles.backgroundImg} />
    </div>
  );
}
