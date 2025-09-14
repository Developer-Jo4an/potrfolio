"use client";
import "../../../../../shared/lib/gsap/init";
import {ProviderComposer} from "../../../../providers/provider-composer";

export default function MainLayout({children}) {

  return (
    <ProviderComposer>
      {children}
    </ProviderComposer>
  );
}