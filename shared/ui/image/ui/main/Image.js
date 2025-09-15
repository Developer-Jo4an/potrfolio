import {image} from "../../../../lib/image/url";
import styles from "./Image.module.scss";
import cl from "classnames";

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