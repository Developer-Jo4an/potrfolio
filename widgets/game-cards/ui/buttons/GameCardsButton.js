import Button from "../../../../shared/ui/button/ui/main/Button";
import styles from "./GameCardsButton.module.scss";

export default function GameCardsButton() {
  const onClick = () => {

  };

  return (
    <Button events={{onClick}} className={styles.gameCardsButton}/>
  );
}