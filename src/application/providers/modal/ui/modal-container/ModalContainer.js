import {motion} from "framer-motion";
import cl from "classnames";
import {useDisposableClick} from "../../../../../shared/model/hooks/use-disposable-click/useDisposableClick";
import useIsCanInteractive from "../../model/hooks/useIsCanInteractive";
import useModalStore from "../../model/state-manager/stores/modalStore";
import {modals} from "../../constants/modals";
import {ANIMATION_NAMES, backgroundAnimations, containerAnimations} from "../../constants/animations";
import styles from "./ModalContainer.module.scss";

export default function ModalContainer(
  {
    type,
    props,
    isCloseOnBackground,
    animation: {
      background = ANIMATION_NAMES.default,
      container = ANIMATION_NAMES.default
    } = {},
    id
  }) {
  const {close} = useModalStore();

  const Component = modals[type] ?? "div";

  const {isCanInteractive, handlers: animationHandlers} = useIsCanInteractive();

  const onClick = useDisposableClick((e) => {
    e.stopPropagation();

    if (isCloseOnBackground) {
      close({id});
      props?.onCloseOnBackground?.();
    }
  });

  return (
    <motion.div
      className={cl(styles.modalWrapper, {
        [styles.modalActive]: isCanInteractive,
        [styles.modalDisabled]: !isCanInteractive
      })}
      {...backgroundAnimations[background]}
      {...animationHandlers}
    >
      <motion.div
        className={styles.modalAnimationContainer}
        {...containerAnimations[container]}
        {...animationHandlers}
        onClick={onClick}
      >
        <div className={styles.modalParent}>
          <Component modalProps={props} id={id}/>
        </div>
      </motion.div>
    </motion.div>
  );
}