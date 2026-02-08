import {useTileExplorerStore} from "../state-manager/tileExplorerStore";
import {OFF, ON, ROUTES, useAppCallbacks, useModalProvider} from "@shared";
import {PAUSED, PLAYING, STATE_MACHINE} from "../../constants/stateMachine";
import {MODES} from "@features/pause-modal";
import content from "../../constants/content";

const {
  menu: {pause},
} = content;

export function usePause() {
  const {wrapper, state} = useTileExplorerStore();
  const {redirect} = useAppCallbacks();
  const {names, add, close} = useModalProvider();

  const isCanPressPause = STATE_MACHINE[state]?.availableStates.includes(PAUSED);

  const {buttons, ...otherProps} = pause;

  const onClick = () => {
    const {
      value: {id: modalId},
    } = add({
      type: names.pauseModal,
      isCloseOnBackground: true,
      props: {
        mod: MODES.blue,
        buttons,
        actions: {
          [ON]() {
            wrapper.state = PLAYING;
            close({id: modalId});
          },
          [OFF]() {
            redirect(ROUTES.index);
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
