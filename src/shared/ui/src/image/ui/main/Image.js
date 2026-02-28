import NextImage from "next/image";
import {image} from "../../../../../lib";
import cl from "classnames";
import styles from "./Image.module.scss";

export function Image({src, className, width = 500, height = 500, alt = "", ...otherProps}) {
  return (
    <NextImage
      src={image(src)}
      className={cl(styles.image, className)}
      draggable={false}
      width={width}
      height={height}
      alt={alt}
      {...otherProps}
    />
  );
}
