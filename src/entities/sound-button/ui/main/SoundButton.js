import {Button, Image, OFF, ON} from "@shared";
import {FaVolumeOff} from "react-icons/fa";
import {AiFillSound} from "react-icons/ai";
import cl from "classnames";
import styles from "./SoundButton.module.scss";

export function SoundButton({background, ref, className, ...otherProps}) {
  let status = ON;

  return (
    <Button
      ref={ref}
      className={cl(styles.soundButton, className)}
      {...otherProps}
    >
      {background && <Image {...background} className={cl(styles.background, background.className)}/>}
      {({[ON]: <AiFillSound/>, [OFF]: <FaVolumeOff/>})[status]}
    </Button>
  );
}