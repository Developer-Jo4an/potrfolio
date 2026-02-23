import {OFF, ON, ROUTES, useAppCallbacks, useModalProvider} from "@shared";

export function usePause({statesData, content, wrapper, state}) {
  const {redirect} = useAppCallbacks();
  const {names, add, close} = useModalProvider();

  const isCanPressPause = statesData.STATE_MACHINE[state]?.availableStates.includes(statesData.PAUSED);

  const {buttons, mod, ...otherProps} = content.menu.pause;

  const onClick = () => {
    const {
      value: {id: modalId}
    } = add({
      type: names.pauseModal,
      isCloseOnBackground: true,
      props: {
        mod,
        buttons,
        actions: {
          [ON]() {
            wrapper.state = statesData.PLAYING;
            close({id: modalId});
          },
          [OFF]() {
            redirect(ROUTES.index);
            close({id: modalId});
          }
        },

        onCloseOnBackground() {
          wrapper.state = statesData.PLAYING;
        }
      }
    });

    wrapper.state = statesData.PAUSED;
  };

  return {isDisabled: !isCanPressPause, events: {onClick}, ...otherProps};
}
