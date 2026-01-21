import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {Image, Confetti, eventSubscription, STATUSES} from "@shared";
import {useDunkShotStore} from "../../model/state-manager/dunkShotStore";
import {CONTROLLER_RESET, THROW_PURE_DATA} from "../../constants/events";
import {pureHitAnimation} from "../../config/animations";
import styles from "./PureHit.module.scss";

const {offset, confetti, motion: motionSettings} = pureHitAnimation;

export function PureHit() {
  const {wrapper} = useDunkShotStore();
  const [pureHit, setPureHit] = useState({x: null, y: null, isActive: false});

  const confettiController = useRef();

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    const savedData = {pureData: {isShoot: false}};

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: THROW_PURE_DATA,
          callback({pureData: {position, isActive, stage}}) {
            if (stage === STATUSES.start) savedData.pureData.isShoot = false;

            if (confettiController.current) {
              const {ref, callbacks} = confettiController.current;

              gsap.set(ref, {
                "--x": `${position.x + offset.x}px`,
                "--y": `${position.y + offset.y}px`,
                width: confetti.width,
                height: confetti.height,
              });

              if (!savedData.pureData.isShoot) {
                callbacks.shoot();
                savedData.pureData.isShoot = true;
              }
            }

            setPureHit({x: position.x + offset.x, y: position.y + offset.y, isActive});
          },
        },
        {
          event: CONTROLLER_RESET,
          callback() {
            setPureHit({x: null, y: null, isActive: false});

            if (confettiController.current) {
              const {callbacks} = confettiController.current;
              callbacks.stop();
            }
          },
        },
      ],
    });
  }, [wrapper]);

  return (
    <>
      <AnimatePresence>
        {pureHit?.isActive && (
          <motion.div
            className={styles.pureHit}
            style={{"--x": `${pureHit?.x}px`, "--y": `${pureHit?.y}px`}}
            {...motionSettings}>
            <div className={styles.pureHitContainer}>
              <Image src={"widgets/dunk-shot-game/pure.png"} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Confetti className={styles.confetti} ref={confettiController} decorateOptions={confetti} />
    </>
  );
}
