import {Button} from "../../../../shared/ui/button";
import {FaVolumeOff} from "react-icons/fa";
import {AiFillSound} from "react-icons/ai";
import Image from "../../../../shared/ui/image/ui/main/Image";
import cl from "classnames";
import {OFF, ON} from "../../../../shared/constants/helpful/statuses";
import styles from "./SoundButton.module.scss";

export default function SoundButton({background, ref, className, ...otherProps}) {
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