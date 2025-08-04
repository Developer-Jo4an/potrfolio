import {createContext, useContext, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {modals as modalsComponents} from "../constants/modal/modals";
import {animations, backgroundAnimations} from "../animations/modal/animations";
import {createId} from "../utils/closing";
import styles from "../styles/providers/modal.module.scss";

const ModalContext = createContext({});

const {get, next} = createId();

export default function ModalProvider({children}) {
  const [modals, setModals] = useState([]);

  const activeModals = modals.reduce((acc, modalData) => {
    const isVisible = !modalData.isQueue || !acc.some(({isQueue}) => isQueue);

    if (isVisible)
      acc.push(modalData);

    return acc;
  }, []);

  const actions = {
    add({type, animation, isQueue = true, props = {}} = {}) {
      const id = get();

      setModals(modals => [...modals, {type, id, animation, isQueue, props}]);

      next();

      return id;
    },
    close({id}) {
      const necessaryFunction = ({
        all() {
          setModals([]);
        },
        active() {
          setModals(prev => prev.filter(({id: modalId}) => !activeModals.includes(modalId)));
        },
        default() {
          setModals(modals => modals.filter(({id: modalId}) => modalId !== id));
        }
      })[id];

      (necessaryFunction ?? necessaryFunction?.default)();
    }
  };

  return (
    <ModalContext.Provider value={{...actions, activeModals: activeModals, modals}}>
      {children}
      <div className={styles.modalProvider}>
        <AnimatePresence>
          {activeModals.map(({type, props, animation, id}) => {
            const Component = modalsComponents[type] ?? "div";

            const animationProps = animations[animation?.container] ?? animations.default;
            const backgroundAnimationProps = backgroundAnimations[animation?.background] ?? backgroundAnimations.default;

            return (
              <motion.div key={id} className={styles.modalWrapper} {...backgroundAnimationProps}>
                <motion.div className={styles.modalAnimationContainer} {...animationProps}>
                  <Component modalProps={props} id={id}/>
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