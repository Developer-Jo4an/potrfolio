"use client"
import ModalProvider from "./ModalProvider";

export default function ProviderComposer({children}) {
  return (
    <ModalProvider>
      {children}
    </ModalProvider>
  );
}