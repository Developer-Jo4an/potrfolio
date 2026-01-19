import {Button, Image, dataAttrs} from "@shared";
import cl from "classnames";
import styles from "./Buttons.module.scss";

export function Buttons({list, mod}) {
  return (
    <div className={styles.buttons} {...dataAttrs({mod})}>
      {list.map(({text, background, className, ...otherProps}, index) => (
        <Button
          key={index}
          className={cl(styles.button, styles[className])}
          {...otherProps}
        >
          {background && <Background {...background}/>}
          {text && <p className={styles.buttonText} data-mod={`i${index}`}>{text}</p>}
        </Button>
      ))}
    </div>
  );
}

function Background({img}) {
  return (
    <Image {...img} className={cl(styles.buttonBackground, img.className)}/>
  );
}