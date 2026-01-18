import useBasketballStore from "../state-manager/basketballStore";
import useModalStore from "../../../../application/providers/modal/model/state-manager/stores/modalStore";
import {useAppCallbacks} from "../../../../application/providers/callbacks/ui/main/CallbacksProvider";
import {BASKETBALL_STATE_MACHINE, PAUSED, PLAYING} from "../../constants/stateMachine";
import content from "../../constants/content";
import {MODAL_NAMES} from "../../../../application/providers/modal";
import {BASKETBALL} from "../../constants/game";
import {OFF, ON} from "../../../../shared/constants/src/helpful/statuses";
import {INDEX} from "../../../../shared/constants/src/pages/routes";

const {menu: {pause}} = content;

export default function usePause() {
  const {wrapper, state} = useBasketballStore();
  const {add, close} = useModalStore();
  const {redirect} = useAppCallbacks();

  const isCanPressPause = BASKETBALL_STATE_MACHINE[state]?.availableStates.includes(PAUSED);

  const {buttons, ...otherProps} = pause;

  const onClick = () => {
    const {value: {id: modalId}} = add({
      type: MODAL_NAMES.pauseModal,
      isCloseOnBackground: true,
      props: {
        mod: BASKETBALL,
        buttons,
        actions: {
          [ON]() {
            wrapper.state = PLAYING;
            close({id: modalId});
          },
          [OFF]() {
            redirect(INDEX);
            close({id: modalId});
          }
        },

        onCloseOnBackground() {
          wrapper.state = PLAYING;
        }
      }
    });

    wrapper.state = PAUSED;
  };

  return {
    isDisabled: !isCanPressPause,
    events: {onClick},
    ...otherProps
  };
}