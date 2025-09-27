"use client";
import "../../../../../shared/lib/gsap/init";
import {ProviderComposer} from "../../../../providers/provider-composer";
import RequestsLoader from "../../../../../entities/request-loader/ui/main/RequestsLoader";

export default function MainLayout({children}) {

  return (
    <ProviderComposer>
      {children}
      <RequestsLoader/>
    </ProviderComposer>
  );
}