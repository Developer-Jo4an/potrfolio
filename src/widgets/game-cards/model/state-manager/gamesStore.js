import {LEFT, RIGHT, createStore} from "@shared";
import {gameList} from "../../config/cardsConfig";

const {useStore: useGamesStore, selectors} = createStore({
  name: "games",
  state: {
    leftGame: gameList[0].id,
    activeGame: gameList[1].id,
    rightGame: gameList[2].id,

    isShowing: true,

    lastSwipeDirection: null
  },
  syncActions: {
    setIsShowing({state}, isShowing) {
      state.isShowing = isShowing;
    },
    onSwipe({state}, {direction}) {
      const {leftGame, activeGame, rightGame} = state;

      const swipeAdd = {[LEFT]: 1, [RIGHT]: -1}[direction];

      const leftIndex = gameList.findIndex(({id}) => id === leftGame);
      const activeIndex = gameList.findIndex(({id}) => id === activeGame);
      const rightIndex = gameList.findIndex(({id}) => id === rightGame);

      const possibleLeftIndex = leftIndex + swipeAdd;
      const possibleActiveIndex = activeIndex + swipeAdd;
      const possibleRightIndex = rightIndex + swipeAdd;

      const newLeftIndex =
        possibleLeftIndex < 0 ? gameList.length - 1 : possibleLeftIndex >= gameList.length ? 0 : possibleLeftIndex;
      const newActiveIndex =
        possibleActiveIndex < 0
          ? gameList.length - 1
          : possibleActiveIndex >= gameList.length
            ? 0
            : possibleActiveIndex;
      const newRightIndex =
        possibleRightIndex < 0 ? gameList.length - 1 : possibleRightIndex >= gameList.length ? 0 : possibleRightIndex;

      state.leftGame = gameList[newLeftIndex]?.id;
      state.activeGame = gameList[newActiveIndex]?.id;
      state.rightGame = gameList[newRightIndex]?.id;

      state.lastSwipeDirection = direction;
    },
    reset({state}) {
      state.isShowing = true;

      state.lastSwipeDirection = null;
    }
  }
});

export {useGamesStore};
