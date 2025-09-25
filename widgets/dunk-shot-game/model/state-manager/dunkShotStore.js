import {createStore} from "../../../../shared/model/state-manager/createStore";
import {getDefaultStats} from "../../constants/defaultStats";
import {getGameConfig} from "../../api/requests";
import {ADD, APPLY, DISABLED, RECALCULATE, SET, SUBTRACT} from "../../../../shared/constants/actions/names";
import {CLOVER, EXTRA_LIFE, X2} from "../../constants/boosters";
import {clamp} from "lodash";
import {DUNK_SHOT} from "../../constants/stateManager";

const {useStore: useDunkShotStore, selectors} = createStore({
  name: DUNK_SHOT,
  state: {
    wrapper: null,
    gameData: {},
    config: {}
  },
  syncActions: {
    setWrapper({state}, wrapper) {
      state.wrapper = wrapper;
    },

    // Игровые экшены
    setDunkShotFields({state}, fields) {
      const {gameData} = state;

      for (const key in fields)
        gameData[key] = fields[key];
    },
    setDunkShotState({state}, newState) {
      const {gameData} = state;

      gameData.state = newState;
    },
    setDunkShotProgress({state, globalStore}, {action, data}) {
      const {gameData} = state;
      const {syncActions} = globalStore.getStoreByName(DUNK_SHOT);

      const actions = {
        [ADD]() {
          if (gameData.progress.max <= gameData.progress.current) {
            gameData.progress.current = 1;
            return;
          }

          gameData.progress.current = Math.min(gameData.progress.max, gameData.progress.current + 1);

          if (gameData.progress.current === gameData.progress.max) {
            gameData.bonusesCount++;
            syncActions.setDunkShotScore({state, globalStore}, {action: ADD, value: gameData.progress.max});
          }
        },
        [SET]({value}) {
          gameData.progress.current = clamp(value, gameData.progress.min, gameData.progress.max);

          if (gameData.progress.current === gameData.progress.max) {
            gameData.bonusesCount++;
            syncActions.setDunkShotScore({state, globalStore}, {action: ADD, value: gameData.progress.max});
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
    setDunkShotScore({state}, {action, value = 1}) {
      const {gameData} = state;

      const x2Multiplier = gameData.boosters?.some(({name, isActive}) => isActive && name === X2) ? 2 : 1;

      const actions = {
        [ADD]() {
          gameData.score += value * x2Multiplier;
        }
      };

      actions[action]?.();
    },
    setDunkShotLifes({state, globalStore}, {action, data}) {
      const {gameData} = state;
      const {syncActions} = globalStore.getStoreByName(DUNK_SHOT);

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

      syncActions.setDunkShotBoosters(state, {action: RECALCULATE});
    },
    setDunkShotStory({state, globalStore}, {action, data}) {
      const {gameData} = state;
      const {syncActions} = globalStore.getStoreByName(DUNK_SHOT);

      const actions = {
        [ADD]({value}) {
          gameData.story.push(value);

          const isX2Active = gameData.boosters?.some(({name, isActive}) => isActive && name === X2);

          if (isX2Active) {
            syncActions.setDunkShotBoosters(state, {action: APPLY, data: X2});
            syncActions.setDunkShotBoosters(state, {action: SUBTRACT, data: X2});
          }
        }
      };

      actions[action]?.(data);
    },
    setDunkShotBoosters({state, globalStore}, {action, data}) {
      const {gameData} = state;
      const {syncActions} = globalStore.getStoreByName(DUNK_SHOT);
      const defaultStats = getDefaultStats();

      const actions = { //todo: отрефакторить большую вложенность
        [DISABLED](isDisabled) {
          gameData.boosters = gameData.boosters.map(boosterData => ({
            ...boosterData,
            isDisabled: ({
              [EXTRA_LIFE]: isDisabled || gameData.lifes >= defaultStats.lifes,
              [X2]: isDisabled,
              [CLOVER]: isDisabled
            })[boosterData.name]
          }));
        },
        [RECALCULATE]() {
          gameData.boosters = gameData.boosters.map(boosterData => ({
            ...boosterData,
            isDisabled: ({
              [EXTRA_LIFE]: boosterData.isDisabled || gameData.lifes >= defaultStats.lifes,
              [X2]: boosterData.isDisabled,
              [CLOVER]: boosterData.isDisabled
            })[boosterData.name]
          }));
        },
        [APPLY](boosterName) {
          ({
            [EXTRA_LIFE]() {
              syncActions.setDunkShotLifes(state, {action: ADD});
              actions[SUBTRACT](EXTRA_LIFE);
            },
            [X2]() {
              gameData.boosters = gameData.boosters.map(boosterData =>
                boosterData.name !== X2
                  ? boosterData
                  : {...boosterData, isActive: !boosterData.isActive}
              );
            },
            [CLOVER]() {
              actions[SUBTRACT](CLOVER);
            }
          })[boosterName]?.();
        },
        [SUBTRACT](boosterName) {
          gameData.boosters = gameData.boosters.map(boosterData =>
            boosterData.name !== boosterName
              ? boosterData
              : {...boosterData, value: Math.max(0, boosterData.value - 1)}
          );
        }
      };

      actions[action]?.(data);
    }
  },
  asyncActions: {
    getGameConfig: {
      request: getGameConfig,
      onFulfilled({state}, {data: config}) {
        state.config = config;
        state.gameData = getDefaultStats();
      }
    }
  },
  interceptors: {},
  selectors: {},
  helpers: {}
});

export default useDunkShotStore;
