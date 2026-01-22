import {useAppCallbacks, useModalProvider, INDEX, OFF, ON} from "@shared";
import {useDunkShotStore} from "../state-manager/dunkShotStore";
import {DUNK_SHOT_STATE_MACHINE, PAUSE, PLAYING} from "../../constants/stateMachine";
import {MODES} from "@features/pause-modal";
import content from "../../constants/content";
const {
  menu: {pause},
} = content;

export function usePause() {
  const {
    gameData: {state},
    wrapper,
  } = useDunkShotStore();
  const {redirect} = useAppCallbacks();
  const {names, add, close} = useModalProvider();

  const isCanPressPause = DUNK_SHOT_STATE_MACHINE[state]?.availableStates?.includes?.(PAUSE);

  const {buttons, ...otherProps} = pause;

  const onClick = () => {
    const {
      value: {id: modalId},
    } = add({
      type: names.pauseModal,
      isCloseOnBackground: true,
      props: {
        mod: MODES.ocean,
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

    wrapper.state = PAUSE;
  };

  return {isDisabled: !isCanPressPause, events: {onClick}, ...otherProps};
}
