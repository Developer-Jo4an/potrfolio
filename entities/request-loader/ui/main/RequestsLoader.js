import Loader from "../../../../shared/ui/loader/ui/main/Loader";
import {useRequestsHandler} from "../../../../shared/model/hooks/use-requests-handler/useRequestsHandler";

export default function RequestsLoader() {
  const {isPendingSome} = useRequestsHandler();
  return <Loader isPending={isPendingSome}/>;
}