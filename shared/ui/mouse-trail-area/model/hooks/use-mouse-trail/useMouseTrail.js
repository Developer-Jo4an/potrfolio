import {useEffect, useRef, useState} from "react";
import MouseTrailWrapper from "../../controllers/MouseTrailWrapper";

export default function useMouseTrail({isActive}) {
  const [wrapper, setWrapper] = useState();
  const containerRef = useRef();

  useEffect(() => {
    (async () => {
      const {current: container} = containerRef;
      await MouseTrailWrapper.instance.initController();
      MouseTrailWrapper.instance.container = container;
      setWrapper(MouseTrailWrapper.instance);
    })();
  }, []);

  useEffect(() => {
    if (wrapper)
      wrapper.isActive = isActive;
  }, [wrapper, isActive]);

  useEffect(() => () => {
    wrapper && (wrapper.isActive = false);
  }, [wrapper]);

  return containerRef;
}