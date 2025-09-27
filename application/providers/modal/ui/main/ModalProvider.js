import {AnimatePresence} from "framer-motion";
import styles from "./ModalProvider.module.scss";
import useModalStore from "../../model/state-manager/stores/modalStore";
import getActiveModals from "../../lib/getActiveModals";
import ModalContainer from "../modal-container/ModalContainer";

export default function ModalProvider({children}) {
  const {modals} = useModalStore();

  const activeModals = getActiveModals(modals);

  return (
    <>
      {children}
      <div className={styles.modalProvider}>
        <AnimatePresence>
          {activeModals.map(props => <ModalContainer key={props.id} {...props}/>)}
        </AnimatePresence>
      </div>
    </>
  );
}
