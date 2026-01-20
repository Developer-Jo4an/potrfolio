import {Loader, useRequestsHandler} from "@shared";

export function RequestsLoader() {
  const {isPendingSome} = useRequestsHandler();
  return <Loader isPending={isPendingSome} />;
}
