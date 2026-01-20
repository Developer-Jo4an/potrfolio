import {ModalProvider} from "../../../modal";
import {CallbacksProvider} from "../../../callbacks";
import {SizeProvider} from "../../../size";
import {ApiProvider} from "../../../api-provider";

export function ProviderComposer({children}) {
  return (
    <SizeProvider>
      <CallbacksProvider>
        <ModalProvider>
          <ApiProvider>{children}</ApiProvider>
        </ModalProvider>
      </CallbacksProvider>
    </SizeProvider>
  );
}
