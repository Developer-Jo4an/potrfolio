import styles from "./Basketball.module.scss";
import {useEffect, useRef} from "react";
import Wrapper from "../../controllers/Wrapper";
import importPIXI from "../../../../shared/lib/scene/pixi/import-pixi";

export default function Basketball() {
  const ref = useRef();

  useEffect(() => {
    (async () => {
      await importPIXI();
      const wrapper = Wrapper.instance;
      await wrapper.initController({$container: ref.current});
      const {controller} = wrapper;
      controller.decorators.update.startUpdate();
    })();
  }, []);

  return (
    <div className={styles.basketball}>
      <div ref={ref} style={{width: 600, height: 600}}></div>
    </div>
  );
}