"use client";
import Loader from "../shared/loader/Loader";
import ProviderComposer from "../../providers/ProviderComposer";

export default function MainLayout({children}) {
  return (
    <ProviderComposer>
      {children}
      <Loader/>
    </ProviderComposer>
  );
}