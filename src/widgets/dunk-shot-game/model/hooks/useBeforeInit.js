import {useDunkShotStore} from "../state-manager/dunkShotStore";
import {DUNK_SHOT_CONFIG_EVENT, DUNK_SHOT_GAME_DATA_EVENT} from "../../constants/events";

export function useBeforeInit() {
  const {getGameConfig} = useDunkShotStore();

  return async (wrapper) => {
    const {eventBus} = wrapper;

    const unsubscriptionForGameData = useDunkShotStore.subscribe(
      (state) => state.gameData,
      (gameData) => eventBus.dispatchEvent({type: DUNK_SHOT_GAME_DATA_EVENT, gameData}),
    );

    const unsubscriptionForConfig = useDunkShotStore.subscribe(
      (state) => state.config,
      (config) => eventBus.dispatchEvent({type: DUNK_SHOT_CONFIG_EVENT, config}),
    );

    await getGameConfig();

    return () => {
      unsubscriptionForGameData();
      unsubscriptionForConfig();
    };
  };
}
