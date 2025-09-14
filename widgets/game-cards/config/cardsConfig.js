export const cardsConfig = {
  activeGame: {
    translateX: 0, translateY: 0, translateZ: 0,
    rotateX: 0, rotateY: 0, rotateZ: 0
  },
  leftGame: {
    translateX: -155, translateY: 0, translateZ: -500,
    rotateX: 0, rotateY: 40, rotateZ: 0
  },
  rightGame: {
    translateX: 155, translateY: 0, translateZ: -500,
    rotateX: 0, rotateY: -40, rotateZ: 0
  },
  inactiveGame: {
    translateX: 0, translateY: 0, translateZ: -1000,
    rotateX: 0, rotateY: 0, rotateZ: 0
  }
};

export const cardsAnimationSettings = {
  showing: {
    activeGame: 0.3,
    leftGame: 0.55,
    rightGame: 0.8
  },
  flipping: {
    leftcenter: {
      translateX: -200, translateZ: -250
    },
    rightcenter: {
      translateX: 200, translateZ: -250
    }
  }
};