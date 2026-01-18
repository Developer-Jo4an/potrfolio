import {useEffect, useRef, useState} from "react";
import {Confetti} from "../../../../shared/ui/confetti";
import {Image} from "../../../../shared/ui/image";
import useDunkShotStore from "../../model/state-manager/dunkShotStore";
import eventSubscription from "../../../../shared/lib/events/eventListener";
import {AnimatePresence, motion} from "framer-motion";
import {CONTROLLER_RESET, THROW_PURE_DATA} from "../../constants/events";
import {START} from "../../../../shared/constants/src/statuses/statuses";
import gsap from "gsap";
import {pureHitAnimation} from "../../config/animations";
import styles from "./DunkShotPureHit.module.scss";

const {offset, confetti, motion: motionSettings} = pureHitAnimation;

export default function DunkShotPureHit() {
  const {wrapper} = useDunkShotStore();
  const [pureHit, setPureHit] = useState({x: null, y: null, isActive: false});

  const confettiController = useRef();

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    const savedData = {
      pureData: {
        isShoot: false
      }
    };

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: THROW_PURE_DATA,
          callback({pureData: {position, isActive, stage}}) {
            if (stage === START)
              savedData.pureData.isShoot = false;

            if (confettiController.current) {
              const {ref, callbacks} = confettiController.current;

              gsap.set(ref, {
                "--x": `${position.x + offset.x}px`,
                "--y": `${position.y + offset.y}px`,
                width: confetti.width, height: confetti.height
              });

              if (!savedData.pureData.isShoot) {
                callbacks.shoot();
                savedData.pureData.isShoot = true;
              }
            }

            setPureHit({x: position.x + offset.x, y: position.y + offset.y, isActive});
          }
        },
        {
          event: CONTROLLER_RESET,
          callback() {
            setPureHit({x: null, y: null, isActive: false});

            if (confettiController.current) {
              const {callbacks} = confettiController.current;
              callbacks.stop();
            }
          }
        }
      ]
    });
  }, [wrapper]);

  return (
    <>
      <AnimatePresence>
        {pureHit?.isActive &&
          <motion.div
            className={styles.pureHit}
            style={{"--x": `${pureHit?.x}px`, "--y": `${pureHit?.y}px`}}
            {...motionSettings}
          >
            <div className={styles.pureHitContainer}>
              <Image src={"widgets/dunk-shot-game/pure.png"}/>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      <Confetti
        className={styles.confetti}
        ref={confettiController}
        decorateOptions={confetti}
      />
    </>
  );
}