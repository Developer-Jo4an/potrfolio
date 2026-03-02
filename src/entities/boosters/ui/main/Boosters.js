import cl from "classnames";
import {BottomMenu} from "@/entities/bottom-menu";
import styles from "./Boosters.module.scss";

export function Boosters({list, ...rest}) {
  const formattedBoosters = list.map(({child, img, ...rest}) => ({
    className: styles.booster,
    child: child?.(styles),
    img: {...img, className: cl(styles.boosterImage, img.className)},
    ...rest,
  }));

  return <BottomMenu buttons={formattedBoosters} {...rest} />;
}
