import Button from "../../shared/button/Button";
import styles from "./CustomButton.module.scss";

export default function CustomButton({text, children, ...otherProps}) {
  return (
    <Button {...otherProps}>
      {text && <span className={styles.text}>{text}</span>}
      {children}
    </Button>
  );
}