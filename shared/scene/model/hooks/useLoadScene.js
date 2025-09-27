import {useEffect} from "react";
import {isFunction} from "lodash";

export default function useLoadScene(
  {
    libraries = [],
    loadWrapper,
    initProps = {},
    containerRef,
    beforeInit,
    afterInit
  }
) {
  useEffect(() => {
    let isUnmount = false;
    let beforeClear = null;
    let afterClear = null;

    (async () => {
      for (const loadLibrary of libraries) {
        if (isUnmount) return;
        await loadLibrary();
      }

      if (isUnmount) return;

      const {default: WrapperClass} = await loadWrapper();
      const wrapper = WrapperClass.instance;
      wrapper.registerController(initProps);
      wrapper.appendContainer(containerRef.current);

      if (isUnmount) return;

      beforeClear = await beforeInit?.(wrapper);

      if (isUnmount) {
        beforeClear?.();
        beforeClear = null;
        return;
      }

      await wrapper.initController();

      if (isUnmount) return;

      afterClear = await afterInit?.(wrapper);

      if (isUnmount)
        afterClear?.();
    })();

    return () => {
      isUnmount = true;
      [beforeClear, afterClear].filter(isFunction).forEach(clear => clear());
    };
  }, []);
}