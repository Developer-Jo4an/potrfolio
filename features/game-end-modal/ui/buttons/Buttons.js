import {Button} from "../../../../shared/ui/button";
import Image from "../../../../shared/ui/image/ui/main/Image";
import cl from "classnames";
import dataAttrs from "../../../../shared/lib/styles/dataAttrs";
import styles from "./Buttons.module.scss";

export default function Buttons({list, mod}) {
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