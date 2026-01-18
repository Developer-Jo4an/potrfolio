import {HiPause} from "react-icons/hi2";
import {Button} from "../../../../shared/ui/button";
import Image from "../../../../shared/ui/image/ui/main/Image";
import cl from "classnames";
import styles from "./PauseButton.module.scss";

export default function PauseButton({background, ref, className, ...otherProps}) {
  return (
    <Button
      ref={ref}
      className={cl(styles.pauseButton, className)}
      {...otherProps}
    >
      {background && <Image {...background} className={cl(styles.background, background.className)}/>}
      <HiPause/>
    </Button>
  );
}