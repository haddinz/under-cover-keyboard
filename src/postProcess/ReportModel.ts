import AssayTestSummary from '../enums/AssayTestSummary';
import ProtocolModel from '../models/protocol/ProtocolModel';
import ReportDataSet from '../models/report/ReportDataSet';
import PostProcessDataSet from './PostProcessDataSet';

export default interface ReportModel {
   identifier: string;
   // postProcess: PostProcessReportModel[];
   runDuration: string;
   generatedAt: string;
   protocolVersion: string;
   runStartedAt: string;
   profile: ProtocolModel;
   dataSet: ReportDataSet;
   postProcess: PostProcessDataSet;
   assayTestSummary?: AssayTestSummary[];
}
