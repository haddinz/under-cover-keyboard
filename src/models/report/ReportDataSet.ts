import CycleColumnRecord from "./CycleColumnRecord";
import RfuChannelInfo from "./RfuChannelInfo";

export default interface ReportDataSet {
  rfuMax: CycleColumnRecord<RfuChannelInfo>[];
  rfuAvg: CycleColumnRecord<RfuChannelInfo>[];
  temperature: CycleColumnRecord<string>[];
}
