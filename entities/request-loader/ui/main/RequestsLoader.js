import {useRequestsHandler} from "../../../../shared/model/hooks/use-requests-handler/useRequestsHandler";
import {Loader} from "../../../../shared/ui/loader";

export default function RequestsLoader() {
  const {isPendingSome} = useRequestsHandler();
  return <Loader isPending={isPendingSome}/>;
}