import {image} from "../../../../lib/src/image/url";
import cl from "classnames";
import styles from "./Image.module.scss";

export default function Image({src, className, ...otherProps}) {
  return (
    <img
      src={image(src)}
      className={cl(styles.image, className)}
      draggable={false}
      {...otherProps}
    />
  );
}