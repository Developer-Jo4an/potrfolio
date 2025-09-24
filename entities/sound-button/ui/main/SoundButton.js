import {Button} from "../../../../shared/ui/button";
import {GiSoundOn} from "react-icons/gi";
import {GiSoundOff} from "react-icons/gi";
import {OFF, ON} from "../../../../shared/constants/helpful/statuses";
import styles from "./SoundButton.module.scss";

export default function SoundButton({ref, ...otherProps}) {
  let status = ON;

  return (
    <Button
      ref={ref}
      className={styles.soundButton}
      {...otherProps}
    >
      {({[ON]: <GiSoundOn/>, [OFF]: <GiSoundOff/>})[status]}
    </Button>
  );
}