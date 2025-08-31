import {usePathname} from "next/navigation";
import {useAppCallbacks} from "../providers/CallbacksProvider";

export const useProtectPage = (handlers = {}) => {
  const pathname = usePathname();

  const appCallbacks = useAppCallbacks();

  const {redirectTo, checker} = handlers[pathname] ?? {};

  if (typeof redirectTo === "string" && typeof checker === "function") {
    const isRedirect = checker();
    isRedirect && appCallbacks.redirectPage(redirectTo);
  }
};