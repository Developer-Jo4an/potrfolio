export const animation = index => {
  const delay = index * 0.15;

  return {
    initial: {
      opacity: 0,
      scale: 0.5
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: {
          delay,
          type: "tween",
          ease: "sineInOut"
        },
        scale: {
          delay,
          type: "tween",
          ease: "backOut"
        }
      }
    }
  };
};