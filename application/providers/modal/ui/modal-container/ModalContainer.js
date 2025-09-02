import {motion} from "framer-motion";
import useModalStore from "../../model/state-manager/stores/modalStore";
import {modals} from "../../constants/modals";
import styles from "./ModalContainer.module.scss";
import {backgroundAnimations, containerAnimation} from "../../constants/animations";
import {useDisposableClick} from "../../../../../shared/model/hooks/use-disposable-click/useDisposableClick";

export default function ModalContainer(
  {
    type,
    props,
    isCloseOnBackground,
    animation: {
      container = containerAnimation,
      background = backgroundAnimations
    } = {},
    id
  }) {
  const {close} = useModalStore();

  const Component = modals[type] ?? "div";

  const onClick = useDisposableClick(() => isCloseOnBackground && close({id}));

  return (
    <motion.div className={styles.modalWrapper} {...background}>
      <motion.div className={styles.modalAnimationContainer} {...container} onClick={onClick}>
        <div className={styles.modalParent} onClick={e => e.stopPropagation()}>
          <Component modalProps={props} id={id}/>
        </div>
      </motion.div>
    </motion.div>
  );
}