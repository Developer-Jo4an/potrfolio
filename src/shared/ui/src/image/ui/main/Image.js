import NextImage from "next/image";
import {image} from "../../../../../lib";
import cl from "classnames";
import styles from "./Image.module.scss";

export function Image({
  src,
  className,
  alt = "",
  width = 500,
  height = 500,
  quality = 100,
  priority = true,
  loading = "eager",
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
      loading={loading}
      alt={alt}
      {...otherProps}
    />
  );
}
