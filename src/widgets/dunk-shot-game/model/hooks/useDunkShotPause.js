import {DUNK_SHOT_STATE_MACHINE, PAUSE, PLAYING} from "../../constants/stateMachine";
import {useDunkShotStore} from "../state-manager/dunkShotStore";
import {MODAL_NAMES, useModalStore} from "@application/providers/modal";
import {INDEX, OFF, ON} from "@shared";
import {DUNK_SHOT_GAME} from "../../constants";
import {useAppCallbacks} from "@application/providers/callbacks";

export function useDunkShotPause() {
  const {
    gameData: {state},
    wrapper,
  } = useDunkShotStore();
  const {add, close} = useModalStore();
  const {redirect} = useAppCallbacks();

  const isCanPressPause = DUNK_SHOT_STATE_MACHINE[state]?.availableStates?.includes?.(PAUSE);

  const onPause = () => {
    const {
      value: {id: modalId},
    } = add({
      type: MODAL_NAMES.pauseModal,
      props: {
        mod: DUNK_SHOT_GAME,
        actions: {
          [ON]() {
            wrapper.state = PLAYING;
            close({id: modalId});
          },
          [OFF]() {
            redirect(INDEX);
            close({id: modalId});
          },
        },
      },
    });

    wrapper.state = PAUSE;
  };

  return {onPause, isCanPressPause};
}
