import {useEffect} from "react";
import eventSubscription from "../../../lib/src/events/eventListener";
import getDefaultState from "../../lib/state/getDefaultState";
import {useAppCallbacks} from "../../../../application/providers/callbacks/ui/main/CallbacksProvider";
import useDunkShotStore from "../../../../widgets/dunk-shot-game/model/state-manager/dunkShotStore";
import useModalStore from "../../../../application/providers/modal/model/state-manager/stores/modalStore";
import {STATE_CHANGED} from "../../constants/events/names";
import {DUNK_SHOT_STATE_MACHINE} from "../../../../widgets/dunk-shot-game/constants/stateMachine";
import {MODAL_NAMES} from "../../../../application/providers/modal";
import {DIRECTORY, DUNK_SHOT_GAME} from "../../../../widgets/dunk-shot-game/constants";
import {INDEX} from "../../../constants/src/pages/routes";
import {OFF, ON} from "../../../constants/src/helpful/statuses";

export default function useStateController(wrapper, ignoreNextStates, stateMachine) {
  const {getGameConfig} = useDunkShotStore();
  const {add, close} = useModalStore();
  const {redirect} = useAppCallbacks();

  const onGameEnd = state => {
    const {wrapper, gameData: {story, pureCount, score}} = useDunkShotStore.getState();

    const {value: {id: modalId}} = add({
      type: MODAL_NAMES.gameEndModal,
      props: {
        status: state,
        imageDirectory: DIRECTORY,
        game: DUNK_SHOT_GAME,
        stats: {
          kd: story.reduce((acc, shot) => {
            acc[shot ? "hit" : "miss"]++;
            return acc;
          }, {hit: 0, miss: 0}),
          story,
          pureCount,
          score
        },
        actions: {
          async [ON]() {
            await wrapper.reset();
            await getGameConfig();
            wrapper.state = getDefaultState(DUNK_SHOT_STATE_MACHINE);
            close({id: modalId});
          },
          [OFF]() {
            redirect(INDEX);
            close({id: modalId});
          }
        }
      }
    });
  };

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus, controller} = wrapper;

    const clear = eventSubscription({
      target: eventBus,
      callbacksBus: [{
        event: STATE_CHANGED,
        async callback({state}) {
          await controller[`${state}Select`]?.();

          if (!ignoreNextStates.includes(state))
            controller.state = stateMachine[state].nextState;

          if (DUNK_SHOT_STATE_MACHINE[state]?.isEndGame)
            onGameEnd(state);
        }
      }]
    });

    controller.state = getDefaultState(stateMachine);

    return clear;
  }, [wrapper]);
}