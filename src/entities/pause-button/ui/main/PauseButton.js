import {HiPause} from "react-icons/hi2";
import {Button, Image} from "@shared";
import cl from "classnames";
import styles from "./PauseButton.module.scss";

export function PauseButton({background, ref, className, ...otherProps}) {
  return (
    <Button ref={ref} className={cl(styles.pauseButton, className)} {...otherProps}>
      {background && <Image {...background} className={cl(styles.background, background.className)} />}
      <HiPause />
    </Button>
  );
}
