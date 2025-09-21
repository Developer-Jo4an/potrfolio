import {useEffect} from "react";

export default function useLoadScene(
  {
    libraries = [],
    loadWrapper,
    initProps = {},
    beforeInit,
    afterInit
  }
) {
  useEffect(() => {

    let isUnmount = false;

    (async () => {
      for (const loadLibrary of libraries) {
        if (isUnmount) return;
        await loadLibrary();
      }

      if (isUnmount) return;

      const {default: WrapperClass} = await loadWrapper();
      const wrapper = WrapperClass.instance;

      if (isUnmount) return;

      const {containerRef, ...otherProps} = initProps;
      beforeInit?.();
      await wrapper.initController({...otherProps, $container: containerRef?.current});
      afterInit?.(wrapper);
    })();

    return () => isUnmount = true;
  }, []);
}