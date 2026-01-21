import {Button, Image} from "@shared";
import cl from "classnames";
import content from "../constants/content";
import styles from "./PauseModal.module.scss";

export function PauseModal({modalProps: {buttons = content.buttons, actions, mod = "default"}}) {
  return (
    <div className={styles.pauseModal} data-mod={mod}>
      <p className={styles.title}>{content.title}</p>
      <p className={styles.description}>{content.description}</p>
      <div className={styles.buttons}>
        {buttons.map(({id, className, background, text}, i) => (
          <Button
            key={id}
            className={cl(styles.button, styles[className])}
            eventFunctions={["stopPropagation"]}
            events={{onClick: actions[id]}}>
            {background && <Image {...background} className={cl(styles.buttonBackground, background.className)} />}
            {text && <span className={styles.buttonText} data-mod={`i${i}`}>{text}</span>}
          </Button>
        ))}
      </div>
    </div>
  );
}
