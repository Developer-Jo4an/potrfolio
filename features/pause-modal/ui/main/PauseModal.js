import {Button} from "../../../../shared/ui/button";
import cl from "classnames";
import content from "./../constants/content";
import styles from "./PauseModal.module.scss";

export default function PauseModal({modalProps: {actions, mod}}) {
  return (
    <div className={cl(styles.pauseModal, styles[mod])}>
      <p className={styles.title}>{content.title}</p>
      <p className={styles.description}>{content.description}</p>
      <div className={styles.buttons}>
        {content.buttons.map(({id, className, text}) => (
          <Button
            key={id}
            className={cl(styles.button, styles[className])}
            events={{onClick: actions[id]}}
          >
            {text}
          </Button>
        ))}
      </div>
    </div>
  );
}
