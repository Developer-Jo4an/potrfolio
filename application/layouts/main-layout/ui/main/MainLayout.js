"use client";

import {ProviderComposer} from "../../../../providers/provider-composer";

export default function MainLayout({children}) {
  return (
    <ProviderComposer>
      {children}
    </ProviderComposer>
  );
}