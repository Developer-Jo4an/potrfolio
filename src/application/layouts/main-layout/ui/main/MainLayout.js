"use client";
import {useMemo} from "react";
import {ProviderComposer, ApiProvider, SizeProvider, CallbacksProvider, ModalProvider} from "@shared";
import {RequestsLoader} from "@entities/request-loader";
import {MODAL_NAMES, modals} from "../../constants/providers/modals";
import "@/shared/scene/src/lib/import/gsap/gsap-global";

export function MainLayout({children}) {
  const providers = useMemo(
    () => [
      {Provider: SizeProvider},
      {Provider: CallbacksProvider},
      {Provider: ModalProvider, data: {modals, names: MODAL_NAMES}},
      {Provider: ApiProvider},
    ],
    [],
  );

  return (
    <ProviderComposer providers={providers}>
      {children}
      <RequestsLoader />
    </ProviderComposer>
  );
}
