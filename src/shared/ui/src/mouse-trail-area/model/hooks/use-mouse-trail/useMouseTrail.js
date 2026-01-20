import {useEffect, useRef, useState} from "react";
import {MouseTrailWrapper} from "../../controllers/MouseTrailWrapper";
import {imports} from "../../../../../../scene";

export function useMouseTrail({isActive}) {
  const [wrapper, setWrapper] = useState();
  const containerRef = useRef();

  useEffect(() => {
    const initialization = async () => {
      await imports.pixi();
      const {current: container} = containerRef;
      await MouseTrailWrapper.instance.initController();
      MouseTrailWrapper.instance.container = container;
      setWrapper(MouseTrailWrapper.instance);
    };

    const initializationPromise = initialization();

    return () => {
      initializationPromise.then(() => (MouseTrailWrapper.instance.isActive = false));
    };
  }, []);

  useEffect(() => {
    if (wrapper) wrapper.isActive = isActive;
  }, [wrapper, isActive]);

  return containerRef;
}
