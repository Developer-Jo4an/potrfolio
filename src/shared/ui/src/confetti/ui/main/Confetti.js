import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import {useImperativeHandle, useRef} from "react";
import {defaultSettings} from "../../constants/settings";

export function Confetti({className, decorateOptions = defaultSettings, ref}) {
  const controller = useRef();
  const containerRef = useRef();

  useImperativeHandle(ref, () => ({
    ref: containerRef.current,
    callbacks: {
      shoot: () => controller.current.shoot(),
      run: (settings = {}) => controller.current.run(settings),
      pause: () => controller.current.pause(),
      stop: () => controller.current.stop()
    }
  }));

  return (
    <div className={className} ref={containerRef}>
      <Fireworks
        decorateOptions={() => ({...defaultSettings, ...decorateOptions})}
        onInit={({conductor}) => controller.current = conductor}
      />
    </div>
  );
}
