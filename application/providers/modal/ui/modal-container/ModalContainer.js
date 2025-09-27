import {motion} from "framer-motion";
import {useDisposableClick} from "../../../../../shared/model/hooks/use-disposable-click/useDisposableClick";
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

  const onClick = useDisposableClick(() => isCloseOnBackground && close({id}));

  return (
    <motion.div className={styles.modalWrapper} {...backgroundAnimations[background]}>
      <motion.div className={styles.modalAnimationContainer} {...containerAnimations[container]} onClick={onClick}>
        <div className={styles.modalParent} onClick={e => e.stopPropagation()}>
          <Component modalProps={props} id={id}/>
        </div>
      </motion.div>
    </motion.div>
  );
}