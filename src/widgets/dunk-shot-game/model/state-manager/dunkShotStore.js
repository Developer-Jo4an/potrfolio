import {createStore, ADD, APPLY, DISABLED, RECALCULATE, SET, SUBTRACT} from "@shared";
import {getDefaultStats} from "../../constants/defaultStats";
import {clamp} from "lodash";
import {WINGS, EXTRA_LIFE, X2} from "../../constants/boosters";
import {DUNK_SHOT} from "../../constants/stateManager";
import {config} from "../../config/config";

const {useStore: useDunkShotStore, selectors} = createStore({
  name: DUNK_SHOT,
  state: {wrapper: null, gameData: {}, config: {}},
  syncActions: {
    setWrapper({state}, wrapper) {
      if (!wrapper) debugger;
      state.wrapper = wrapper;
    },

    // Игровые экшены
    setState({state}, newState) {
      const {gameData} = state;
      gameData.state = newState;
    },
    setDunkShotProgress({state, globalStore}, {action, data}) {
      const {gameData} = state;
      const {originSyncActions} = globalStore.getStoreByName(DUNK_SHOT);

      const actions = {
        [ADD]() {
          if (gameData.progress.max <= gameData.progress.current) {
            gameData.progress.current = 1;
            return;
          }

          gameData.progress.current = Math.min(gameData.progress.max, gameData.progress.current + 1);

          if (gameData.progress.current === gameData.progress.max) {
            gameData.bonusesCount++;
            originSyncActions.setDunkShotScore({state, globalStore}, {action: ADD, value: gameData.progress.max});
          }
        },
        [SET]({value}) {
          gameData.progress.current = clamp(value, gameData.progress.min, gameData.progress.max);

          if (gameData.progress.current === gameData.progress.max) {
            gameData.bonusesCount++;
            originSyncActions.setDunkShotScore({state, globalStore}, {action: ADD, value: gameData.progress.max});
          }
        }
      };

      actions[action]?.(data);
    },
    setDunkShotPure({state}, {action, data}) {
      const {gameData} = state;

      const actions = {
        [ADD]() {
          gameData.pureCount++;
        }
      };

      actions[action]?.(data);
    },
    setDunkShotScore({state, globalStore}, {action, value = 1}) {
      const {gameData} = state;
      const {helpers} = globalStore.getStoreByName(DUNK_SHOT);

      const x2Multiplier = helpers.isActiveSomeBooster(state, X2) ? 2 : 1;

      const actions = {
        [ADD]() {
          gameData.score += value * x2Multiplier;
        }
      };

      actions[action]?.();
    },
    setDunkShotLifes({state, globalStore}, {action, data}) {
      const {gameData} = state;
      const {originSyncActions} = globalStore.getStoreByName(DUNK_SHOT);

      const actions = {
        [ADD]() {
          const defaultStats = getDefaultStats();
          gameData.lifes = Math.min(gameData.lifes + 1, defaultStats.lifes);
        },
        [SUBTRACT]() {
          gameData.lifes = Math.max(0, gameData.lifes - 1);
        }
      };

      actions[action]?.(data);

      originSyncActions.setDunkShotBoosters({state, globalStore}, {action: RECALCULATE});
    },
    setDunkShotStory({state, globalStore}, {action, data}) {
      const {gameData} = state;
      const {originSyncActions, helpers} = globalStore.getStoreByName(DUNK_SHOT);

      const actions = {
        [ADD]({value}) {
          gameData.story.push(value);

          const isX2Active = helpers.isActiveSomeBooster(state, X2);

          if (isX2Active) {
            originSyncActions.setDunkShotBoosters({state, globalStore}, {action: APPLY, data: X2});
            originSyncActions.setDunkShotBoosters({state, globalStore}, {action: SUBTRACT, data: X2});
          }
        }
      };

      actions[action]?.(data);
    },
    setDunkShotBoosters({state, globalStore}, {action, data}) {
      const {gameData} = state;
      const {originSyncActions} = globalStore.getStoreByName(DUNK_SHOT);
      const defaultStats = getDefaultStats();

      const actions = {
        //todo: отрефакторить большую вложенность
        [DISABLED](isDisabled) {
          gameData.boosters = gameData.boosters.map((boosterData) => ({
            ...boosterData,
            isDisabled: {
              [EXTRA_LIFE]: isDisabled || gameData.lifes >= defaultStats.lifes,
              [X2]: isDisabled,
              [WINGS]: isDisabled
            }[boosterData.name]
          }));
        },
        [RECALCULATE]() {
          gameData.boosters = gameData.boosters.map((boosterData) => ({
            ...boosterData,
            isDisabled: {
              [EXTRA_LIFE]: boosterData.isDisabled || gameData.lifes >= defaultStats.lifes,
              [X2]: boosterData.isDisabled,
              [WINGS]: boosterData.isDisabled
            }[boosterData.name]
          }));
        },
        [APPLY](boosterName) {
          ({
            [EXTRA_LIFE]() {
              originSyncActions.setDunkShotLifes({state, globalStore}, {action: ADD});
              actions[SUBTRACT](EXTRA_LIFE);
            },
            [X2]() {
              gameData.boosters = gameData.boosters.map((boosterData) =>
                boosterData.name !== X2 ? boosterData : {...boosterData, isActive: !boosterData.isActive}
              );
            },
            [WINGS]() {
              actions[SUBTRACT](WINGS);
            }
          })[boosterName]?.();
        },
        [SUBTRACT](boosterName) {
          gameData.boosters = gameData.boosters.map((boosterData) =>
            boosterData.name !== boosterName
              ? boosterData
              : {...boosterData, value: Math.max(0, boosterData.value - 1)}
          );
        }
      };

      actions[action]?.(data);
    },
    setGameConfig({state}) {
      state.config = config;

      state.gameData = {
        ...getDefaultStats(),
        boosters: Object.entries(config.boosters).map(([key, value]) => ({
          name: key,
          value,
          isActive: false,
          isDisabled: false
        }))
      };
    },
    reset({state}) {
      state.wrapper = null;
      state.config = {};
      state.gameData = {};
    }
  },
  interceptors: {},
  selectors: {},
  helpers: {
    isActiveSomeBooster(state, boosterName) {
      const {gameData} = state;
      return gameData.boosters?.some(({name, isActive}) => isActive && name === boosterName);
    }
  }
});

export {useDunkShotStore};
