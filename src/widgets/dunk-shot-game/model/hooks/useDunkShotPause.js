import useModalStore from "../../../../application/providers/modal/model/state-manager/stores/modalStore";
import {DUNK_SHOT_STATE_MACHINE, PAUSE, PLAYING} from "../../constants/stateMachine";
import useDunkShotStore from "../state-manager/dunkShotStore";
import {MODAL_NAMES} from "../../../../application/providers/modal";
import {OFF, ON} from "../../../../shared/constants/helpful/statuses";
import {useAppCallbacks} from "../../../../application/providers/callbacks/ui/main/CallbacksProvider";
import {INDEX} from "../../../../shared/constants/pages/routes";
import {DUNK_SHOT_GAME} from "../../constants";

export default function useDunkShotPause() {
  const {gameData: {state}, wrapper} = useDunkShotStore();
  const {add, close} = useModalStore();
  const {redirect} = useAppCallbacks();

  const isCanPressPause = DUNK_SHOT_STATE_MACHINE[state]?.availableStates?.includes?.(PAUSE);

  const onPause = () => {
    const {value: {id: modalId}} = add({
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
          }
        }
      }
    });

    wrapper.state = PAUSE;
  };

  return {onPause, isCanPressPause};
};