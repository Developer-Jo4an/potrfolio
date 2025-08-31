import ModalProvider from "./ModalProvider";
import SizeProvider from "./SizeProvider";
import CallbacksProvider from "./CallbacksProvider";
import HooksProvider from "./HooksProvider";
import ServiceDataProvider from "./ServiceDataProvider";
import {serviceDataStorageSettings} from "../constants/storage/serviceDataStorageSettings";

export default function ProviderComposer({children}) {
  return (
    <SizeProvider>
      <CallbacksProvider>
        <ModalProvider>
          <HooksProvider>
            <ServiceDataProvider storageSettings={serviceDataStorageSettings}>
              {children}
            </ServiceDataProvider>
          </HooksProvider>
        </ModalProvider>
      </CallbacksProvider>
    </SizeProvider>
  );
}