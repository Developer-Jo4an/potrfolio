"use client";
import {ProviderComposer} from "@/application/providers/provider-composer";
import {RequestsLoader} from "@entities/request-loader";
import "@/shared/scene/src/lib/import/gsap/gsap-global";

export function MainLayout({children}) {
  return (
    <ProviderComposer>
      {children}
      <RequestsLoader />
    </ProviderComposer>
  );
}
