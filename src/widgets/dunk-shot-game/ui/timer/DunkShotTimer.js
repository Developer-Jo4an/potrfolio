import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import useDunkShotStore from "../../model/state-manager/dunkShotStore";
import eventSubscription from "../../../../shared/lib/src/events/eventListener";
import styles from "./DunkShotTimer.module.scss";
import {BASKET_TIMER_END, BASKET_TIMER_START, BASKET_TIMER_UPDATE, CONTROLLER_RESET} from "../../constants/events";
import {timerAnimation} from "../../config/animations";

const {offset, motion: motionSettings} = timerAnimation;

export default function DunkShotTimer() {
  const {wrapper} = useDunkShotStore();
  const [basketTimer, setBasketTimer] = useState({progress: null, position: null, isActive: false});

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    const updateTimer = ({progress, position}) =>
      setBasketTimer({
        progress, position: {
          x: position.x + offset.x,
          y: position.y + offset.y
        }, isActive: true
      });

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: BASKET_TIMER_START,
          callback: updateTimer
        },
        {
          event: BASKET_TIMER_UPDATE,
          callback: updateTimer
        },
        {
          event: BASKET_TIMER_END,
          callback() {
            setBasketTimer(prev => ({...prev, isActive: false}));
          }
        },
        {
          event: CONTROLLER_RESET,
          callback() {
            setBasketTimer({progress: null, position: null, isActive: false});
          }
        }
      ]
    });
  }, [wrapper]);

  return (
    <AnimatePresence>
      {basketTimer.isActive &&
        <motion.div
          className={styles.timerContainer}
          style={{"--x": `${basketTimer.position?.x}px`, "--y": `${basketTimer.position?.y}px`}}
          {...motionSettings}
        >
          <div
            className={styles.timerProgress}
            style={{"--progress": `${basketTimer.progress * 100 - 100}%`}}
          />
        </motion.div>
      }
    </AnimatePresence>
  );
}