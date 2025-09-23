export const timerAnimation = {
  offset: {
    x: 0, y: 75
  },
  motion: {
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

export const pureHitAnimation = {
  offset: {x: 0, y: -40},
  confetti: {
    width: 240, height: 240,
    decorateOptions: {particleCount: 25, startVelocity: 7.5}
  },
  motion: {
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
