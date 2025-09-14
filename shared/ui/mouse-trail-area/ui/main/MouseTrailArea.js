import styles from "./MouseTrailArea.module.scss";
import useMouseTrail from "../../model/hooks/use-mouse-trail/useMouseTrail";

export default function MouseTrailArea({isActive = true}) {
  const containerRef = useMouseTrail({isActive});

  return <div ref={containerRef} className={styles.mouseTrailArea}/>;
}