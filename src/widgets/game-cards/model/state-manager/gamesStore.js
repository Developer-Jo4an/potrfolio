import {createStore} from "../../../../shared/model/src/state-manager/createStore";
import {getGameList} from "../../api/requests";
import {LEFT, RIGHT} from "../../../../shared/constants/src/directions/directions";

const {useStore: useGamesStore, selectors} = createStore({
  name: "games",
  state: {
    gameList: [],

    activeGame: null,
    leftGame: null,
    rightGame: null,

    isShowing: true,

    lastSwipeDirection: null
  },
  syncActions: {
    setIsShowing({state}, isShowing) {
      state.isShowing = isShowing;
    },
    onSwipe({state}, {direction}) {
      const {gameList, leftGame, activeGame, rightGame} = state;

      const swipeAdd = ({[LEFT]: 1, [RIGHT]: -1})[direction];

      const leftIndex = gameList.findIndex(({id}) => id === leftGame);
      const activeIndex = gameList.findIndex(({id}) => id === activeGame);
      const rightIndex = gameList.findIndex(({id}) => id === rightGame);

      const possibleLeftIndex = leftIndex + swipeAdd;
      const possibleActiveIndex = activeIndex + swipeAdd;
      const possibleRightIndex = rightIndex + swipeAdd;

      const newLeftIndex = possibleLeftIndex < 0 ? gameList.length - 1 : possibleLeftIndex >= gameList.length ? 0 : possibleLeftIndex;
      const newActiveIndex = possibleActiveIndex < 0 ? gameList.length - 1 : possibleActiveIndex >= gameList.length ? 0 : possibleActiveIndex;
      const newRightIndex = possibleRightIndex < 0 ? gameList.length - 1 : possibleRightIndex >= gameList.length ? 0 : possibleRightIndex;

      state.leftGame = gameList[newLeftIndex]?.id;
      state.activeGame = gameList[newActiveIndex]?.id;
      state.rightGame = gameList[newRightIndex]?.id;

      state.lastSwipeDirection = direction;
    },
    reset({state}) {
      state.gameList = [];

      state.isShowing = true;

      state.lastSwipeDirection = null;
    }
  },
  asyncActions: {
    getGameList: {
      request: getGameList,
      onFulfilled({state}, {data: gameList}) {
        state.gameList = gameList;

        if (![state.leftGame, state.activeGame, state.rightGame].every(Boolean)) {
          const [leftGame, activeGame, rightGame] = gameList;

          state.leftGame = leftGame.id;
          state.activeGame = activeGame.id;
          state.rightGame = rightGame.id;
        }
      }
    }
  }
});

export default useGamesStore;