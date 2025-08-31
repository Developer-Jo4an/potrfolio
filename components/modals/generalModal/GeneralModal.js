import styles from "./GeneralModal.module.scss";
import cl from "classnames";
import {useEffect} from "react";
import Image from "next/image";
import CustomButton from "../../business/CustomButton/CustomButton";

export default function GeneralModal({modalProps: {title, description, topImage, buttons, close = {}}, id}) {
  useEffect(() => () => close.onCloseCallback?.(), []);

  return (
    <div className={styles.generalModal}>
      <div className={styles.generalModalContent}>
        {topImage && <div className={styles.topImageWrapper}>
          <Image
            src={topImage.src}
            className={cl(styles.topImage, topImage.className)}
            width={340}
            height={220}
            alt={""}
          />
        </div>}

        {title && <h3 className={styles.title}>
          {title}
        </h3>}

        {description && <p className={styles.description}>
          {description}
        </p>}

        {buttons && <div className={styles.buttonsWrapper}>
          {buttons.map(((buttonProps, index) =>
            <CustomButton
              key={index}
              {...buttonProps}
              className={cl(...[styles.button, buttonProps.className].filter(Boolean))}
            />))}
        </div>}
      </div>
    </div>
  );
}