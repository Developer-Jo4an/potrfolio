import SizeProvider from "../../../size/ui/main/SizeProvider";
import CallbacksProvider from "../../../callbacks/ui/main/CallbacksProvider";
import ModalProvider from "../../../modal/ui/main/ModalProvider";

export default function ProviderComposer({children}) {
  return (
    <SizeProvider>
      <CallbacksProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </CallbacksProvider>
    </SizeProvider>
  );
}