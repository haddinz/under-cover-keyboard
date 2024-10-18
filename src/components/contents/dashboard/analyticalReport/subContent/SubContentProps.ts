import EventHandlerSource from "../../../../../helper/EventHandlerSource";
import ReportModel from "../../../../../postProcess/ReportModel";
import ToggleSeriesEvt from "../helper/ToggleSeriesEvt";

type SubContentProps = {
  reportModel: ReportModel,
  onResetHandler: EventHandlerSource<null>,
  setSeriesHandler: EventHandlerSource<ToggleSeriesEvt>,
  onStartExportingGraph: EventHandlerSource<null>,
  // onFinishExportingGraph: CustomEventHandler<null>
};
export default SubContentProps;
