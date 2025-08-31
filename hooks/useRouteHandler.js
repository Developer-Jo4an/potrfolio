import {usePathname} from "next/navigation";
import {useLayoutEffect} from "react";

export const useRouteHandler = (handlers = {}) => {
  const pathname = usePathname();

  useLayoutEffect(() => {
    handlers[pathname]?.();
  }, [pathname, handlers]);
};