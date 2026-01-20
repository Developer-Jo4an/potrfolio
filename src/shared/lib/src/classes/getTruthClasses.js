import cl from "classnames";

export function getTruthClasses(...classes) {
  return cl(...classes.flat(Number.MAX_VALUE).filter(Boolean));
}
