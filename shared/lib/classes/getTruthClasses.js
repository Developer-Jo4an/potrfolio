import cl from "classnames";

export default function getTruthClasses(...classes) {
  return cl(...classes.flat(Number.MAX_VALUE).filter(Boolean));
}