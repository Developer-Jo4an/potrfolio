export const templateAnimation = {
  initial: {scale: 1.3},
  animate: {scale: 1},
  exit: {scale: 0.7},
  transition: {ease: "easeOut", duration: 0.3}
};

export const notFoundAnimation = {
  initial: {scale: 0.5, opacity: 0},
  animate: {scale: 1, opacity: 1},
  transition: {duration: 0.3, delay: 0.5, ease: "backOut"}
};
