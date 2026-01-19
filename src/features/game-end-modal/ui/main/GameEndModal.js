import {Background} from "../background/Background";
import {Title} from "../title/Title";
import {Img} from "../img/Img";
import {Stats} from "../stats/Stats";
import {Buttons} from "../buttons/Buttons";
import cl from "classnames";
import styles from "./GameEndModal.module.scss";

export function GameEndModal({modalProps: {background, title, img, stats, buttons}}) {
  return (
    <div className={cl(styles.gameEndModal)}>
      {background && <Background {...background}/>}
      {title && <Title {...title}/>}
      {img && <Img {...img}/>}
      {stats && <Stats {...stats}/>}
      {buttons && <Buttons {...buttons}/>}
    </div>
  );
}