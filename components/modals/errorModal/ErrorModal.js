import styles from "./ErrorModal.module.scss";
import CustomButton from "../../business/CustomButton/CustomButton";

export default function ErrorModal(
  {
    modalProps: {
      message = "Произошла какая-то ошибка",
      buttons = []
    },
    id
  }) {
  return (
    <div className={styles.errorModal}>
      <div className={styles.errorModalContent}>
        <p className={styles.errorMessage}></p>

        <div className={styles.buttonsWrapper}>
          {buttons.map((buttonProps, index) => <CustomButton key={index} {...buttonProps}/>)}
        </div>
      </div>
    </div>
  );
}