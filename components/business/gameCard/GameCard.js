import styles from "./GameCard.module.scss";
import Image from "next/image";
import {gameCard} from "../../../content/gameCard";
import {useModal} from "../../../providers/ModalProvider";
import {modalConstructor} from "../../../constructors/modalContructor/modalConstructor";
import CustomButton from "../CustomButton/CustomButton";

export default function GameCard({game, game: {id, title, description}}) {
  const {img} = gameCard[id];

  const {add} = useModal();

  const createModal = modalConstructor();

  const onClick = () => {
    const gamePreviewData = createModal({modalType: "gamePreviewModal", props: {game}});
    add({type: "general", ...gamePreviewData});
  };

  return (
    <CustomButton
      className={styles.gameCard}
      events={{onClick}}
    >
      <Image
        className={styles.gameCardImg}
        src={img}
        alt={""}
        width={160}
        height={80}
      />

      <h2 className={styles.gameCardTitle}>{title}</h2>

      <p className={styles.gameCardDescription}>
        {description}
      </p>
    </CustomButton>
  );
}