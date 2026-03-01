import NextImage from "next/image";
import {image} from "../../../../../lib";
import cl from "classnames";
import styles from "./Image.module.scss";

export function Image({
  src,
  className,
  alt = "",
  width = 256,
  height = 256,
  quality = 100,
  priority = false,
  unoptimized = false,
  ...otherProps
}) {
  return (
    <NextImage
      src={image(src)}
      className={cl(styles.image, className)}
      draggable={false}
      width={width}
      height={height}
      quality={quality}
      priority={priority}
      unoptimized={unoptimized}
      alt={alt}
      {...otherProps}
    />
  );
}
