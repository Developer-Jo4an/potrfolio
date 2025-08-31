import {createContext, useContext, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {modals as modalsComponents} from "../constants/modal/modals";
import {animations, backgroundAnimations} from "../animations/modal/animations";
import {createId} from "../utils/closing";
import styles from "../styles/providers/modal.module.scss";

const ModalContext = createContext({});

const getId = createId();

export default function ModalProvider({children}) {
  const [modals, setModals] = useState([]);

  const activeModals = modals.reduce((acc, modalData) => {
    const isVisible = !modalData.isQueue || !acc.some(({isQueue}) => isQueue);

    if (isVisible)
      acc.push(modalData);

    return acc;
  }, []);

  const actions = {
    add({type, animation, isCloseOnBackground = false, isQueue = true, props = {}} = {}) {
      const id = getId();

      setModals(modals => [...modals, {type, id, isCloseOnBackground, animation, isQueue, props}]);

      return id;
    },
    close({id}) {
      const necessaryFunction = {
        all() {
          setModals([]);
        },
        active() {
          setModals(prev => prev.filter(modalData => !activeModals.includes(modalData)));
        },
        default() {
          setModals(modals => modals.filter(({id: modalId}) => modalId !== id));
        }
      };

      (necessaryFunction[id] ?? necessaryFunction.default)();
    }
  };

  return (
    <ModalContext.Provider value={{...actions, activeModals: activeModals, modals}}>
      {children}
      <div className={styles.modalProvider}>
        <AnimatePresence>
          {activeModals.map(({type, props, isCloseOnBackground, animation, id}) => {
            const Component = modalsComponents[type] ?? "div";

            const animationProps = animations[animation?.container] ?? animations.default;
            const backgroundAnimationProps = backgroundAnimations[animation?.background] ?? backgroundAnimations.default;

            return (
              <motion.div
                key={id}
                className={styles.modalWrapper}
                {...backgroundAnimationProps}
              >
                <motion.div
                  className={styles.modalAnimationContainer}
                  {...animationProps}
                  onClick={() => isCloseOnBackground && actions.close({id})}
                >
                  <div className={styles.modalParent} onClick={e => e.stopPropagation()}>
                    <Component modalProps={props} id={id}/>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);