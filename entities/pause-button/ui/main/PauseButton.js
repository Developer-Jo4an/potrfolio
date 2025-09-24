import {HiPause} from "react-icons/hi2";
import {Button} from "../../../../shared/ui/button";
import styles from "./PauseButton.module.scss";

export default function PauseButton({ref, ...otherProps}) {
  return (
    <Button
      ref={ref}
      className={styles.pauseButton}
      {...otherProps}
    >
      <HiPause/>
    </Button>
  );
}