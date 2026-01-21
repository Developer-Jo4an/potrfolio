import {useAppCallbacks} from "@application/providers/callbacks";
import {useModalStore} from "@application/providers/modal";
import {MODAL_NAMES} from "@application/providers/modal";
import {OFF, ON, INDEX} from "@shared";
import content from "../../constants/content";
import {BASKETBALL_STATE_MACHINE, PAUSED, PLAYING} from "../../constants/stateMachine";
import {useBasketballStore} from "../state-manager/basketballStore";
import {MODES} from "@features/pause-modal";

const {
  menu: {pause},
} = content;

export function usePause() {
  const {wrapper, state} = useBasketballStore();
  const {add, close} = useModalStore();
  const {redirect} = useAppCallbacks();

  const isCanPressPause = BASKETBALL_STATE_MACHINE[state]?.availableStates.includes(PAUSED);

  const {buttons, ...otherProps} = pause;

  const onClick = () => {
    const {
      value: {id: modalId},
    } = add({
      type: MODAL_NAMES.pauseModal,
      isCloseOnBackground: true,
      props: {
        mod: MODES.orange,
        buttons,
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

        onCloseOnBackground() {
          wrapper.state = PLAYING;
        },
      },
    });

    wrapper.state = PAUSED;
  };

  return {isDisabled: !isCanPressPause, events: {onClick}, ...otherProps};
}
