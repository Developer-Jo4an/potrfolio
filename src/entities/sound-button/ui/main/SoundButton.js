import {Button, Image, OFF, ON} from "@shared";
import {IoVolumeHigh} from "react-icons/io5";
import {IoMdVolumeOff} from "react-icons/io";
import cl from "classnames";
import styles from "./SoundButton.module.scss";

export function SoundButton({background, ref, className, ...otherProps}) {
  let status = ON;

  return (
    <Button ref={ref} className={cl(styles.soundButton, className)} {...otherProps}>
      {background && <Image {...background} className={cl(styles.background, background.className)} />}
      {{[ON]: <IoVolumeHigh />, [OFF]: <IoMdVolumeOff />}[status]}
    </Button>
  );
}
