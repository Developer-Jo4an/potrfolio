import {createContext, useContext} from "react";
import {AnimatePresence} from "framer-motion";
import {getActiveModals} from "../../lib/getActiveModals";
import {ModalContainer} from "../modal-container/ModalContainer";
import {useModalStore} from "@shared";
import styles from "./ModalProvider.module.scss";

const ModalContext = createContext({});

export function ModalProvider({modals: modalsLib, names, children}) {
  const storeData = useModalStore();

  const activeModals = getActiveModals(storeData.modals);

  return (
    <ModalContext.Provider value={{...storeData, names}}>
      {children}
      <div className={styles.modalProvider}>
        <AnimatePresence>
          {activeModals.map((props) => (
            <ModalContainer key={props.id} modals={modalsLib} {...props} />
          ))}
        </AnimatePresence>
      </div>
    </ModalContext.Provider>
  );
}

export const useModalProvider = () => useContext(ModalContext);
