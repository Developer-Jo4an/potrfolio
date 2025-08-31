export const animations = {
  default: {
    initial: {
      scale: 0.5
    },
    animate: {
      scale: 1,
      transition: {
        scale: {
          type: "tween",
          ease: "backOut",
          duration: 0.3
        }
      }
    },
    exit: {
      scale: 0.5,
      transition: {
        scale: {
          type: "tween",
          ease: "backIn",
          duration: 0.3,
        }
      }
    }
  }
};

export const backgroundAnimations = {
  default: {
    initial: {opacity: 0},
    animate: {opacity: 1},
    exit: {opacity: 0},
    transition: {
      duration: 0.3,
      type: "tween",
      ease: "easeInOut"
    }
  }
};