import {OFF, ON, INDEX, useAppCallbacks, useModalProvider} from "@shared";
import content from "../../constants/content";
import {BASKETBALL_STATE_MACHINE, PAUSED, PLAYING} from "../../constants/stateMachine";
import {useBasketballStore} from "../state-manager/basketballStore";
import {MODES} from "@features/pause-modal";

const {
  menu: {pause},
} = content;

export function usePause() {
  const {wrapper, state} = useBasketballStore();
  const {redirect} = useAppCallbacks();
  const {names, add, close} = useModalProvider();

  const isCanPressPause = BASKETBALL_STATE_MACHINE[state]?.availableStates.includes(PAUSED);

  const {buttons, ...otherProps} = pause;

  const onClick = () => {
    const {
      value: {id: modalId},
    } = add({
      type: names.pauseModal,
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
