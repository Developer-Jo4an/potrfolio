"use client";
import ModalProvider from "./ModalProvider";
import SizeProvider from "./SizeProvider";
import CallbacksProvider from "./CallbacksProvider";
import Loader from "../components/shared/loader/Loader";

export default function ProviderComposer({children}) {
  return (
    <SizeProvider>
      <ModalProvider>
        <CallbacksProvider>
          {children}
          <Loader/>
        </CallbacksProvider>
      </ModalProvider>
    </SizeProvider>
  );
}