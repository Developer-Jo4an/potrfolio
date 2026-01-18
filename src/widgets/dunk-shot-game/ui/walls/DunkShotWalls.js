import {useEffect, useRef} from "react";
import cl from "classnames";
import eventSubscription from "../../../../shared/lib/src/events/eventListener";
import {LEFT, RIGHT} from "../../../../shared/constants/src/directions/directions";
import {RESIZE} from "../../../../shared/constants/src/events/eventsNames";
import gsap from "gsap";
import styles from "./DunkShotWalls.module.scss";

export default function DunkShotWalls({containerRef}) {
  const wallRefs = useRef([]);

  useEffect(() => {
    const {current: walls} = wallRefs;
    const {current: container} = containerRef;

    const onResize = () => {
      const {left, right, width} = container.getBoundingClientRect();

      [left, right - width].forEach((width, index) => {
        const currentWall = walls[index];
        gsap.set(currentWall, {width});
      });
    };

    onResize();

    return eventSubscription({callbacksBus: [{event: RESIZE, callback: onResize}]});
  }, []);

  return (
    <div className={styles.walls}>
      {[LEFT, RIGHT].map((side, index) => (
        <div
          key={index}
          className={cl(styles.wall, styles[side])}
          ref={ref => wallRefs.current[index] = ref}
        />
      ))}
    </div>
  );
}